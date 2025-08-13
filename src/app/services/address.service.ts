import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private env = environment;
  private http = inject(HttpClient);

  createaddress(addressPayload: {
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
      `${this.env.apiUrl}/api/addresses`,
      addressPayload,
      { headers }
    );
  }

  updateaddress(
    iri: string,
    addressPayload: {
      street: string;
      city: string;
      postalCode: string;
      region: string;
      country: string;
      latitude?: number;
      longitude?: number;
    }
  ): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json',
    });
    return this.http.patch<void>(`${this.env.apiUrl}${iri}`, addressPayload, {
      headers,
    });
  }
}
