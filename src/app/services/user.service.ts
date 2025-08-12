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
    return this.http.get<User>(`${this.env.apiUrl}/api/me`);
  }

  updateUser(userUri: string, data: Partial<User>) {
    return this.http.patch<User>(`${this.env.apiUrl}${userUri}`, data, {
      headers: {
        'Content-Type': 'application/merge-patch+json',
      },
    });
  }
}
