import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private env = environment;

  getFromIri<T>(iri: string): Observable<T> {
    return this.http.get<T>(`${this.env.apiUrl}${iri}`);
  }
}
