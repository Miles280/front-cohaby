import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Booking } from '../../models/booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private env = environment;
  private http = inject(HttpClient);
  private userService = inject(UserService);

  getMyBookings() {
    return this.userService
      .getCurrentUser()
      .pipe(
        switchMap((user) =>
          this.http
            .get<any>(
              `${this.env.apiUrl}/bookings?user=/api/users/${user.id}&order[beginningDate]=desc`
            )
            .pipe(map((res) => res['member'] as Booking[]))
        )
      );
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/bookings`, booking, {
      headers: { 'Content-Type': 'application/ld+json' },
    });
  }

  getBookingsByListing(listingId: number) {
    return this.http
      .get<any>(
        `${this.env.apiUrl}/bookings?listing=/api/listings/${listingId}`
      )
      .pipe(map((res) => res.member as Booking[]));
  }

  updateBookingStatus(
    bookingId: number,
    status: 'accepted' | 'declined' | 'cancelled'
  ): Observable<Booking> {
    return this.http.patch<any>(
      `${this.env.apiUrl}/bookings/${bookingId}`,
      { status },
      {
        headers: { 'Content-Type': 'application/merge-patch+json' },
      }
    );
  }
}
