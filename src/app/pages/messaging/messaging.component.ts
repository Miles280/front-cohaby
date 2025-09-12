import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  receiverId!: string;
  receiver!: User;
  currentUserId!: number;
  messages: any[] = [];
  conversations: any[] = [];
  messageControl = new FormControl('');

  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.route.queryParams.subscribe((params) => {
          this.receiverId = params['to'];
          if (this.receiverId) {
            this.userService.getUserById(this.receiverId).subscribe({
              next: (user) => {
                this.receiver = user;
              },
            });
            this.loadMessages(this.receiverId);
          } else {
            this.loadConversations();
          }
        });
      },
    });
  }

  loadMessages(receiverId: string) {
    this.messageService
      .getConversation(this.currentUserId, +receiverId)
      .subscribe({
        next: (res) => {
          this.messages = res || [];
        },
        error: (err) => console.error(err),
      });
  }

  loadConversations() {
    this.messageService
      .getConversations(this.currentUserId)
      .subscribe((convs: any[]) => {
        const uniqueConvs: any[] = [];
        const seen = new Set();

        convs.forEach((conv) => {
          const otherUserId =
            conv.senderId === this.currentUserId
              ? conv.receiverId
              : conv.senderId;

          // Si cette conversation n'a pas encore été ajoutée
          if (!seen.has(otherUserId)) {
            seen.add(otherUserId);

            this.userService.getUserById(otherUserId).subscribe((user) => {
              conv.otherUser = user;
            });

            uniqueConvs.push(conv);
          }
        });

        this.conversations = uniqueConvs;
      });
  }

  sendMessage() {
    const content = this.messageControl.value?.trim();
    if (!content || !this.receiverId) return;

    this.messageService
      .sendMessage(this.currentUserId, +this.receiverId, content)
      .subscribe((msg) => {
        this.messages.push(msg);
        this.messageControl.reset();
      });
  }

  selectConversation(conv: any) {
    if (!conv?.otherUser?.id) return;
    this.router.navigate(['/messages'], {
      queryParams: { to: conv.otherUser.id },
    });
  }
}
