import { Component, inject, OnInit } from '@angular/core';
import { Listing } from '../../../models/listings.interface';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css',
})
export class ListingDetailsComponent implements OnInit {
  listing!: Listing;

  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.listingService.getListingById(id).subscribe({
        next: (data) => {
          console.log(data);
          this.listing = data;
        },
        error: (err) => console.error('Erreur chargement listing', err),
      });
    }
  }

  currentPictureIndex = 0;
  showPreviousPicture(): void {
    if (this.listing.pictures && this.listing.pictures.length > 0) {
      this.currentPictureIndex =
        (this.currentPictureIndex - 1 + this.listing.pictures.length) %
        this.listing.pictures.length;
    }
  }

  showNextPicture(): void {
    if (this.listing.pictures && this.listing.pictures.length > 0) {
      this.currentPictureIndex =
        (this.currentPictureIndex + 1) % this.listing.pictures.length;
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
