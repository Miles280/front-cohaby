import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private env = environment;

  getAll(path: string): Observable<any> {
    return this.http.get(`${this.env.apiUrl}${path}`);
  }
}
