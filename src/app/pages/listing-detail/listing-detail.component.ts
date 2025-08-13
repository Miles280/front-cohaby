import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../models/listings.interface';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css',
})
export class ListingDetailsComponent implements OnInit {
  listing: Listing | null = null;
  owner: any = null;
  address: any = null;
  services: any[] = [];
  equipment: any[] = [];
  pictures: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.listingService.getListingById(id).subscribe({
        next: (data) => {
          this.listing = data;

          const owner$ = data.owner
            ? this.apiService.getFromIri(data.owner)
            : null;

          const address$ = data.address
            ? this.apiService.getFromIri(data.address)
            : null;

          const services$ = data.services?.length
            ? forkJoin(
                data.services.map((iri) => this.apiService.getFromIri(iri))
              )
            : null;

          const equipment$ = data.equipments?.length
            ? forkJoin(
                data.equipments.map((iri) => this.apiService.getFromIri(iri))
              )
            : null;

          const pictures$ = data.pictures?.length
            ? forkJoin(
                data.pictures.map((iri) => this.apiService.getFromIri(iri))
              )
            : null;

          forkJoin({
            owner: owner$ ?? [],
            address: address$ ?? [],
            services: services$ ?? [],
            equipment: equipment$ ?? [],
            pictures: pictures$ ?? [],
          }).subscribe((results) => {
            this.owner = results.owner;
            this.address = results.address;
            this.services = results.services;
            this.equipment = results.equipment;
            this.pictures = results.pictures;

            // 👉 Affiche toutes les données une fois qu’elles sont prêtes
            console.log('Listing complet :', {
              listing: this.listing,
              owner: this.owner,
              address: this.address,
              services: this.services,
              equipment: this.equipment,
              pictures: this.pictures,
            });
          });
        },
        error: (err) => console.error('Erreur chargement listing', err),
      });
    }
  }

  currentPictureIndex = 0;

  showPreviousPicture(): void {
    if (this.pictures && this.pictures.length > 0) {
      this.currentPictureIndex =
        (this.currentPictureIndex - 1 + this.pictures.length) %
        this.pictures.length;
    }
  }

  showNextPicture(): void {
    if (this.pictures && this.pictures.length > 0) {
      this.currentPictureIndex =
        (this.currentPictureIndex + 1) % this.pictures.length;
    }
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
