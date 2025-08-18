import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Listing } from '../../models/listings.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private http = inject(HttpClient);
  private env = environment;

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

  updateListing(id: number, listing: any): Observable<any> {
    return this.http.put<any>(`${this.env.apiUrl}/listings/${id}`, listing);
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/services`);
  }

  getEquipments(): Observable<any> {
    return this.http.get<any>(`${this.env.apiUrl}/equipment`);
  }
}
