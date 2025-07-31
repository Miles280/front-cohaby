import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdressService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

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
      `${this.apiUrl}/adresses`,
      adressPayload,
      { headers }
    );
  }
}
