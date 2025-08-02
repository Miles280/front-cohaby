import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Listing } from '../../models/listings.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private env = environment;
  private http = inject(HttpClient);

  getAllListings(): Observable<Listing[]> {
    return this.http.get<any>(`${this.env.apiUrl}/api/listings`).pipe(
      map((response) => response['member']) // ou 'hydra:member' si ton API renvoie encore ce format
    );
  }

  getListingById(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.env.apiUrl}/api/listings/${id}`);
  }
}
