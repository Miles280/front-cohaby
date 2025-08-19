import { Component, inject, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { Router } from '@angular/router';
import { ListingFormComponent } from '../../components/listing-form/listing-form.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listing-create',
  standalone: true,
  imports: [ListingFormComponent],
  templateUrl: './listing-create.component.html',
  styleUrl: './listing-create.component.css',
})
export class ListingCreateComponent implements OnInit {
  private router = inject(Router);
  private listingService = inject(ListingService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const roles = this.authService.getRoles();
    if (!roles.includes('ROLE_OWNER')) {
      this.router.navigate(['/']);
    }
  }

  createListing(data: any) {
    console.log('Form data reçu :', data);

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        const payload = {
          title: data.title,
          description: data.description,
          pricePerNight: data.pricePerNight,
          maxCapacity: data.maxCapacity,
          services: data.services,
          equipments: data.equipments,
          owner: `/api/users/${user.id}`,
          address: {
            street: data.address.street,
            city: data.address.city,
            postalCode: data.address.postalCode,
            region: data.address.region || '',
            country: data.address.country || '',
            latitude: 0,
            longitude: 0,
          },
        };
        console.log('Payload envoyé au backend :', payload);

        this.listingService.createListing(payload).subscribe({
          next: (listing) => {
            console.log('Listing créé :', listing);
            this.router.navigate(['/listing', listing.id]);
          },
          error: (err) => {
            console.error('Erreur lors de la création du listing :', err);
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du user courant :', err);
      },
    });
  }
}
