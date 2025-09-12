import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private env = environment;

  getConversation(userId: Number, otherId: Number): Observable<any> {
    return this.http.get<any[]>(
      `${this.env.apiUrl}/conversations/${userId}/${otherId}`
    );
  }

  sendMessage(
    senderId: Number,
    receiverId: Number,
    content: string
  ): Observable<any> {
    return this.http.post(
      `${this.env.apiUrl}/messages`,
      {
        sender: `/api/users/${senderId}`,
        receiver: `/api/users/${receiverId}`,
        content,
      },
      {
        headers: { 'Content-Type': 'application/ld+json' },
      }
    );
  }

  getConversations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.env.apiUrl}/conversations/${userId}`);
  }
}
