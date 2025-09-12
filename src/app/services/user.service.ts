import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private env = environment;

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.env.apiUrl}/me`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.env.apiUrl}/users/${id}`);
  }

  /**
   * Met à jour un utilisateur existant
   * @param id - l'ID de l'utilisateur
   * @param payload - l'objet utilisateur à mettre à jour
   * @returns Observable<User>
   */
  updateUser(id: number, payload: any): Observable<User> {
    return this.http.patch<User>(`${this.env.apiUrl}/users/${id}`, payload, {
      headers: { 'Content-Type': 'application/merge-patch+json' },
    });
  }
}
