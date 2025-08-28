import { Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../../models/booking.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: Booking[] = [];

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (res) => ((this.bookings = res), console.log(res)),
      error: (err) => console.error(err),
    });
  }

  getListingId(booking: Booking): number {
    return +booking.listing.split('/').pop()!;
  }
}
