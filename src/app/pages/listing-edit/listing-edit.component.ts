import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ListingFormComponent } from '../../components/listing-form/listing-form.component';

@Component({
  selector: 'app-listing-edit',
  standalone: true,
  imports: [ListingFormComponent],
  templateUrl: './listing-edit.component.html',
  styleUrl: './listing-edit.component.css',
})
export class ListingEditComponent implements OnInit {
  listing: any;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listingService = inject(ListingService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.getListingById(id).subscribe((res) => {
      this.listing = res;
    });
  }

  updateListing(data: any) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.updateListing(id, data).subscribe({
      next: () => this.router.navigate(['/listings', id]),
      error: (err) => console.error(err),
    });
  }
}
