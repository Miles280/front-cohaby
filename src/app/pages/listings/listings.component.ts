import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ApiService } from '../../services/api.service';
import { Listing } from '../../../models/listings.interface';
import { Picture } from '../../../models/picture.interface';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Equipment } from '../../../models/equipment.interface';
import { firstValueFrom } from 'rxjs';
import { Service } from '../../../models/service.interface';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './listings.component.html',
})
export class ListingsComponent implements OnInit {
  listings: Listing[] = [];
  filteredListings: Listing[] = [];
  isLoading = true;

  private listingService = inject(ListingService);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.listingService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
        console.log(this.listings);
        this.filteredListings = data;

        // Charger la première image pour chaque listing
        this.listings.forEach((listing) => {
          const firstPictureIri = listing.pictures[0];
          if (firstPictureIri) {
            this.apiService.getFromIri<Picture>(firstPictureIri).subscribe({
              next: (picData) => {
                listing.firstPicture = picData;
              },
              error: (err) => {
                console.error('Erreur chargement image :', err);
              },
            });
          }
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement listings :', err);
        this.isLoading = false;
      },
    });
  }

  async onSearch(filter: any) {
    console.log('Filtres reçus :', filter);

    const hasFilters = Object.values(filter).some((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== null && val !== '' && val !== undefined;
    });

    if (!hasFilters) {
      this.filteredListings = this.listings;
      return;
    }

    try {
      const res = await firstValueFrom(
        this.listingService.getListingsWithFilter(filter)
      );
      let filtered = res['member'];

      if (filter.equipments?.length > 0) {
        const selectedNames: string[] = filter.equipments;
        const filteredWithEquipments = await Promise.all(
          filtered.map(async (listing: Listing) => {
            if (!listing.equipments || listing.equipments.length === 0)
              return null;
            const eqObjects = await firstValueFrom(
              this.apiService.getMultipleFromIri<Equipment>(listing.equipments)
            );
            if (!eqObjects) return null;
            const equipmentNames = eqObjects.map((e) => e.name);
            const match = selectedNames.every((name) =>
              equipmentNames.includes(name)
            );
            return match ? { ...listing, equipmentsObjects: eqObjects } : null;
          })
        );
        filtered = filteredWithEquipments.filter(Boolean) as Listing[];
      }

      if (filter.services?.length > 0) {
        const selectedNames: string[] = filter.services;
        const filteredWithServices = await Promise.all(
          filtered.map(async (listing: Listing) => {
            if (!listing.services || listing.services.length === 0) return null;
            const srvObjects = await firstValueFrom(
              this.apiService.getMultipleFromIri<Service>(listing.services)
            );
            if (!srvObjects) return null;
            const serviceNames = srvObjects.map((s) => s.name);
            const match = selectedNames.every((name) =>
              serviceNames.includes(name)
            );
            return match ? { ...listing, servicesObjects: srvObjects } : null;
          })
        );
        filtered = filteredWithServices.filter(Boolean) as Listing[];
      }

      this.filteredListings = filtered;

      // Chargement images (inchangé)
      this.filteredListings.forEach((listing) => {
        const firstPictureIri = listing.pictures[0];
        if (firstPictureIri) {
          this.apiService.getFromIri<Picture>(firstPictureIri).subscribe({
            next: (picData) => {
              listing.firstPicture = picData;
            },
            error: (err) => {
              console.error('Erreur chargement image filtrée :', err);
            },
          });
        }
      });
    } catch (err) {
      console.error('Erreur lors de la recherche avec filtre:', err);
    }
  }
}
