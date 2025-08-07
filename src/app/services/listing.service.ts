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
      .get<any>(`${this.env.apiUrl}/api/listings`)
      .pipe(map((response) => response['member']));
  }

  getListingById(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.env.apiUrl}/api/listings/${id}`);
  }

  getListingsWithFilter(filter: any): Observable<any> {
    let params = new HttpParams();

    if (filter.location) {
      params = params.set('adress.city', filter.location);
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
    return this.http.get(`${this.env.apiUrl}/api/listings`, { params });
  }
}
