import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  formSubmitted = false;
  inputPWType = 'password';
  isLoading = false;
  apiError: string | null = null;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  togglePW(): void {
    this.inputPWType = this.inputPWType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.apiError = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.authService.saveToken(res.token);
        this.loginForm.reset();
        this.formSubmitted = false;
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.apiError = err?.error?.message || 'Erreur lors de la connexion.';
        this.isLoading = false;
      },
    });
  }
}
