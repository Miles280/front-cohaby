import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../models/user.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user!: User;

  profileForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.router.navigate(['/']);
        return;
      }

      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          this.initForm(this.user);
        },
        error: () => this.router.navigate(['/login']),
      });
    });
  }

  initForm(user: User) {
    this.profileForm = this.fb.group({
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      pseudo: [user.pseudo, Validators.required],
      gender: [user.gender, Validators.required],
      birthdate: [user.birthdate?.split('T')[0], Validators.required], // format date
      email: [user.email, [Validators.required, Validators.email]],

      // Champs addresse (user.address peut être null)
      street: [user.address.street || '', Validators.required],
      city: [user.address.city || '', Validators.required],
      postalCode: [user.address.postalCode || '', Validators.required],
      region: [user.address.region || '', Validators.required],
      country: [user.address.country || '', Validators.required],
    });
  }

  onSubmit() {
    if (!this.profileForm.valid) return;

    const formValue = this.profileForm.value;
    const payload = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      pseudo: formValue.pseudo,
      gender: formValue.gender,
      birthdate: new Date(formValue.birthdate).toISOString(),
      email: formValue.email,
      password: formValue.password,
      address: {
        street: formValue.street,
        city: formValue.city,
        postalCode: formValue.postalCode,
        region: formValue.region,
        country: formValue.country,
        latitude: this.user.address.latitude || 0,
        longitude: this.user.address.longitude || 0,
        // latitude et longitude a voir pour la suite
      },
    };

    this.userService.updateUser(this.user.id, payload).subscribe({
      next: () => {
        alert('Profil mis à jour');
      },
      error: () => {
        alert('Erreur lors de la mise à jour du profil');
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
