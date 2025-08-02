import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env = environment;

  private loggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  public isLoggedIn$ = this.loggedIn.asObservable();

  private http = inject(HttpClient);

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/api/login`, credentials);
  }

  // auth.service.ts
  register(payload: {
    firstname: string;
    lastname: string;
    pseudo: string;
    gender: string;
    birthdate: string;
    email: string;
    password: string;
    roles: string[];
    adress: string; // uri de l'adresse
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
    return this.http.post(`${this.env.apiUrl}/api/users`, payload, {
      headers,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
