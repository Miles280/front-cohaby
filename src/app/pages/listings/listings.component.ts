import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../../models/listings.interface';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

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

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.listingService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
        console.log(this.listings);
        this.filteredListings = data;
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

    // Vérifier si aucun filtre n’est appliqué
    const hasFilters = Object.values(filter).some((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== null && val !== '' && val !== undefined;
    });

    if (!hasFilters) {
      this.filteredListings = this.listings;
      return;
    }

    this.filteredListings = this.listings.filter((listing) => {
      let match = true;

      // Filtre par ville (recherche partielle, ignore si vide/undefined)
      if (filter.city) {
        match =
          match &&
          listing.address.city
            .toLowerCase()
            .includes(filter.city.toLowerCase());
      }

      if (filter.maxPrice) {
        const maxPrice = Number(filter.maxPrice);
        match = match && listing.pricePerNight <= maxPrice;
      }

      if (filter.maxCapacity) {
        const maxCapacity = Number(filter.maxCapacity);
        match = match && listing.maxCapacity <= maxCapacity;
      }

      // Filtre équipements (tous doivent être présents, ignore si vide/undefined)
      if (filter.equipments?.length) {
        match =
          match &&
          filter.equipments.every((eq: string) =>
            listing.equipments?.some((lEq) => lEq.name === eq)
          );
      }

      // Filtre services (tous doivent être présents, ignore si vide/undefined)
      if (filter.services?.length) {
        match =
          match &&
          filter.services.every((srv: string) =>
            listing.services?.some((lSrv) => lSrv.name === srv)
          );
      }

      return match;
    });

    console.log(this.filteredListings);
  }
}
