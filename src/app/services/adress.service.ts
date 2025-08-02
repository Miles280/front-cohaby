import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdressService {
  private env = environment;
  private http = inject(HttpClient);

  createAdress(adressPayload: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
    latitude?: number;
    longitude?: number;
  }): Observable<{ '@id': string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
    return this.http.post<{ '@id': string }>(
      `${this.env.apiUrl}/api/adresses`,
      adressPayload,
      { headers }
    );
  }
}
