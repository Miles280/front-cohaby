import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private env = environment;

  private loggedIn = new BehaviorSubject<boolean>(
    !!localStorage.getItem('token')
  );
  public isLoggedIn$ = this.loggedIn.asObservable();

  private roleSubject = new BehaviorSubject<string[]>(
    JSON.parse(localStorage.getItem('roles') || '[]')
  );
  public role$ = this.roleSubject.asObservable();

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.env.apiUrl}/login`, credentials);
  }

  register(payload: {
    firstname: string;
    lastname: string;
    pseudo: string;
    gender: string;
    birthdate: string;
    email: string;
    password: string;
    roles: string[];
    address: {
      street: string;
      city: string;
      postalCode: string;
      region: string;
      country: string;
      latitude: number;
      longitude: number;
    };
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json' });
    return this.http.post(`${this.env.apiUrl}/users`, payload, {
      headers,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);

    // Décoder le token pour récupérer les rôles
    const decoded = this.decodeToken(token);
    if (decoded?.roles) {
      const roles: string[] = decoded.roles;
      localStorage.setItem('roles', JSON.stringify(roles));
      this.roleSubject.next(roles);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token', e);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
