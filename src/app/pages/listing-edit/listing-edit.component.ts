import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ListingFormComponent } from '../../components/listing-form/listing-form.component';
import { Listing } from '../../../models/listings.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-listing-edit',
  standalone: true,
  imports: [ListingFormComponent],
  templateUrl: './listing-edit.component.html',
  styleUrl: './listing-edit.component.css',
})
export class ListingEditComponent implements OnInit {
  listing!: Listing;
  user: any;

  private listingService = inject(ListingService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.listingService.getListingById(this.id).subscribe((listiing) => {
          this.listing = listiing;
          console.log(this.listing);

          const isOwner = this.listing.owner.id === this.user.id;
          const isAdmin = this.user.roles.includes('ROLE_ADMIN');

          if (!isOwner && !isAdmin) {
            // 🚫 Pas autorisé → redirection accueil
            this.router.navigate(['/']);
          }
        });
      },
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
