import { Component, inject, OnInit } from '@angular/core';
import { Listing } from '../../../models/listings.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, RouterLink],
  templateUrl: './listing-detail.component.html',
  styleUrl: './listing-detail.component.css',
})
export class ListingDetailsComponent implements OnInit {
  listing!: Listing;
  bookingForm!: FormGroup;
  listingId!: string;
  isLoggedIn = false;
  currentUser!: User;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.listingService.getListingById(id).subscribe({
        next: (data) => {
          console.log(data);
          this.listing = data;
          this.listingId = this.route.snapshot.paramMap.get('id')!;
        },
        error: (err) => console.error('Erreur chargement listing', err),
      });
    }

    this.bookingForm = this.fb.group({
      beginningDate: ['', Validators.required],
      totalNights: [1, [Validators.required, Validators.min(1)]],
      nbrGuests: [1, [Validators.required, Validators.min(1)]],
    });
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

  onSubmit() {
    if (this.bookingForm.invalid) return;

    const payload = {
      ...this.bookingForm.value,
      status: 'pending',
      listing: `/api/listings/${this.listingId}`, // ou IRI complet selon ton API
      user: `/api/users/${this.currentUser.id}`,
    };

    console.log(`Payload envoyé :`, payload);
    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        console.log('Listing créé :', payload);
        this.router.navigate(['/mybookings']);
      },
      error: (err) => console.log("Erreur pendant l'envoie à l'api :", err),
    });
  }
}
