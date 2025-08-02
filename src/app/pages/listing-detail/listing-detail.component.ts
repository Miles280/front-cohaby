import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../models/listings.interface';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css',
})
export class ListingDetailsComponent implements OnInit {
  listing: Listing | null = null;

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.listingService.getListingById(id).subscribe({
        next: (data) => (this.listing = data),
        error: (err) => console.error('Erreur chargement listing', err),
      });
    }
  }
}
