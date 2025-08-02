import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../models/listings.interface';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css',
})
export class ListingsComponent implements OnInit {
  listings: Listing[] = [];

  constructor(private listingService: ListingService) {}

  ngOnInit(): void {
    this.listingService.getAllListings().subscribe({
      next: (data) => ((this.listings = data), console.log(data)),
      error: (err) => console.error('Erreur chargement listings', err),
    });
  }
}
