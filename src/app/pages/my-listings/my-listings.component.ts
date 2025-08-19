import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Listing } from '../../../models/listings.interface';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css',
})
export class MyListingsComponent implements OnInit {
  private listingService = inject(ListingService);

  listings: Listing[] = [];

  ngOnInit(): void {
    this.loadListings;
    this.listingService.getMyListings().subscribe({
      next: (res) => ((this.listings = res), console.log(res)),
      error: (err) => console.error(err),
    });
  }

  loadListings() {
    this.listingService.getMyListings().subscribe({
      next: (res) => ((this.listings = res), console.log(res)),
      error: (err) => console.error(err),
    });
  }

  deleteListing(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      this.listingService.deleteListing(id).subscribe({
        next: () => this.loadListings(),
        error: (err) => console.error(err),
      });
    }
  }
}
