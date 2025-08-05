import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ApiService } from '../../services/api.service';
import { Listing } from '../../../models/listings.interface';
import { Picture } from '../../../models/picture.interface';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listings.component.html',
})
export class ListingsComponent implements OnInit {
  listings: Listing[] = [];
  isLoading = true;

  constructor(
    private listingService: ListingService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.listingService.getAllListings().subscribe({
      next: (data) => {
        // On récupère les données de base des listings
        this.listings = data;

        // Pour chaque listing, on va chercher la première image s'il y a des IRI
        this.listings.forEach((listing) => {
          const firstPictureIri = listing.pictures[0];
          this.apiService.getFromIri<Picture>(firstPictureIri).subscribe({
            next: (picData) => {
              listing.firstPicture = picData;
            },
            error: (err) => {
              console.error('Erreur chargement image :', err);
            },
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement listings :', err);
        this.isLoading = false;
      },
    });
  }
}
