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
import { ApiService } from '../../services/api.service';
import { Adress } from '../../../models/adress.interface';
import { AdressService } from '../../services/adress.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user!: User;
  adress!: Adress;
  profileForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private apiService = inject(ApiService);
  private adressService = inject(AdressService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) return;

      this.userService.getCurrentUser().subscribe({
        next: (data) => {
          this.user = data;
          this.initForm(this.user);
        },
        error: () => this.router.navigate(['/login']),
      });
    });
  }

  initForm(user: User) {
    let adress = user.adress;

    if (typeof adress === 'string') {
      // Impossible d'accéder aux champs si c'est juste un IRI
      // Tu peux choisir de ne rien faire ou d'afficher une erreur
      console.error("L'adresse est une IRI, pas un objet complet");
      return;
    }

    this.profileForm = this.fb.group({
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      pseudo: [user.pseudo, Validators.required],
      gender: [user.gender, Validators.required],
      birthdate: [user.birthdate?.split('T')[0], Validators.required], // format date
      email: [user.email, [Validators.required, Validators.email]],

      // Champs adresse (user.adress peut être null)
      street: [adress.street || '', Validators.required],
      city: [adress.city || '', Validators.required],
      postalCode: [adress.postalCode || '', Validators.required],
      region: [adress.region || '', Validators.required],
      country: [adress.country || '', Validators.required],
    });
  }

  onSave() {
    if (!this.profileForm.valid || !this.user || !this.user.adress) return;

    let adress = this.user.adress;

    if (typeof adress === 'string') {
      // Impossible d'accéder aux champs si c'est juste un IRI
      // Tu peux choisir de ne rien faire ou d'afficher une erreur
      console.error("L'adresse est une IRI, pas un objet complet");
      return;
    }

    const formValue = this.profileForm.value;

    const updatedAdress = {
      ...this.adress,
      street: formValue.street,
      city: formValue.city,
      postalCode: formValue.postalCode,
      region: formValue.region,
      country: formValue.country,
    };

    // Mise à jour de l'adresse
    this.adressService
      .updateAdress(`/api/adresses/${adress.id}`, updatedAdress)
      .subscribe({
        next: () => {
          const updatedUser = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            pseudo: formValue.pseudo,
            gender: formValue.gender,
            birthdate: new Date(formValue.birthdate).toISOString(),
            email: formValue.email,
            adress: `/api/adresses/${adress.id}`, // IRI, pas objet !
          };
          console.log(updatedUser);
          // Mise à jour du profil utilisateur
          this.userService
            .updateUser(`/api/users/${this.user.id}`, updatedUser)
            .subscribe({
              next: () => alert('Profil mis à jour'),
              error: () => alert('Erreur lors de la mise à jour du profil'),
            });
        },
        error: () => alert("Erreur lors de la mise à jour de l'adresse"),
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
