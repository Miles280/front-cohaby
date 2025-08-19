import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Listing } from '../../models/listings.interface';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private http = inject(HttpClient);
  private env = environment;
  private userService = inject(UserService);

  getAllListings(): Observable<Listing[]> {
    return this.http
      .get<any>(`${this.env.apiUrl}/listings`)
      .pipe(map((response) => response['member']));
  }

  getListingById(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.env.apiUrl}/listings/${id}`);
  }

  getListingsWithFilter(filter: any): Observable<any> {
    let params = new HttpParams();

    if (filter.location) {
      params = params.set('address.city', filter.location);
    }

    if (filter.priceMax) {
      params = params.set('pricePerNight[lte]', filter.priceMax);
    }

    if (filter.maxCapacity) {
      params = params.set('maxCapacity[lte]', filter.maxCapacity);
    }

    if (filter.equipments && Array.isArray(filter.equipments)) {
      filter.equipments.forEach((eq: string) => {
        params = params.append('equipments.name', eq);
      });
    }

    console.log("Params envoyés à l'API :", params.toString());
    return this.http.get(`${this.env.apiUrl}/listings`, { params });
  }

  createListing(listing: any): Observable<any> {
    return this.http.post<any>(`${this.env.apiUrl}/listings`, listing, {
      headers: { 'Content-Type': 'application/ld+json' }, // optionnel, HttpClient le fait souvent
    });
  }

  updateListing(id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.env.apiUrl}/listings/${id}`, payload, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    });
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/services`);
  }

  getEquipments(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/equipment`);
  }

  getMyListings() {
    return this.userService.getCurrentUser().pipe(
      switchMap((user) =>
        this.http
          .get<any>(`${this.env.apiUrl}/listings?owner=/api/users/${user.id}`)
          .pipe(
            // Ici on extrait seulement `member`
            map((res) => res['member'] as Listing[])
          )
      )
    );
  }

  deleteListing(id: number) {
    return this.http.delete(`${this.env.apiUrl}/listings/${id}`);
  }
}
