import { Component, inject, OnInit } from '@angular/core';
import { Booking } from '../../../models/booking.interface';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-bookings.component.html',
  styleUrl: './listing-bookings.component.css',
})
export class ListingBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  listingId!: number;

  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  ngOnInit(): void {
    this.listingId = +this.route.snapshot.paramMap.get('id')!;
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookingsByListing(this.listingId).subscribe({
      next: (res) => {
        (this.bookings = res), console.log(res);
      },
      error: (err) => console.error('Erreur chargement bookings', err),
    });
  }

  changeStatus(
    booking: Booking,
    status: 'accepted' | 'declined' | 'cancelled'
  ): void {
    this.bookingService.updateBookingStatus(booking.id, status).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Erreur maj booking', err),
    });
  }
}
