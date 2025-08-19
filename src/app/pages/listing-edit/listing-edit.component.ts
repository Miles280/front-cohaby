import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ListingFormComponent } from '../../components/listing-form/listing-form.component';
import { Listing } from '../../../models/listings.interface';

@Component({
  selector: 'app-listing-edit',
  standalone: true,
  imports: [ListingFormComponent],
  templateUrl: './listing-edit.component.html',
  styleUrl: './listing-edit.component.css',
})
export class ListingEditComponent implements OnInit {
  listing!: Listing;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);
  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.listingService.getListingById(this.id).subscribe((data) => {
      this.listing = data;
      console.log(this.listing);
    });
  }

  updateListing(data: any) {
    console.log(`Payload envoyé : ${data}`);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.updateListing(id, data).subscribe({
      next: () => {
        this.router.navigate(['/listings', id]),
          this.router.navigate(['/listing', this.id]);
      },

      error: (err) => console.error(err),
    });
  }
}
