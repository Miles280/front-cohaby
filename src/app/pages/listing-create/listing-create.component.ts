import { Component, inject } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { Router } from '@angular/router';
import { ListingFormComponent } from '../../components/listing-form/listing-form.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-listing-create',
  standalone: true,
  imports: [ListingFormComponent],
  templateUrl: './listing-create.component.html',
  styleUrl: './listing-create.component.css',
})
export class ListingCreateComponent {
  private listingService = inject(ListingService);
  private userService = inject(UserService);
  private router = inject(Router);

  createListing(data: any) {
    console.log('Form data reçu :', data);

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        const payload = {
          title: data.title,
          description: data.description,
          pricePerNight: data.price,
          maxCapacity: data.maxCapacity,
          services: data.services,
          equipment: data.equipment,
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
