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
import { address } from '../../../models/address.interface';
import { AddressService } from '../../services/address.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user!: User;
  address!: address;
  profileForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private addressService = inject(AddressService);
  private apiService = inject(ApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) return;

      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          console.log(user);

          if (typeof user.address === 'string') {
            // Utiliser ApiService.getFromIri pour récupérer l'adresse complète
            this.apiService.getFromIri<address>(user.address).subscribe({
              next: (addr) => {
                this.address = addr;
                this.user.address = addr;
                this.initForm(this.user);
              },
              error: () => {
                console.error(
                  "Erreur lors de la récupération de l'adresse complète"
                );
                this.initForm(this.user); // init quand même le formulaire
              },
            });
          } else {
            this.address = user.address;
            this.initForm(this.user);
          }
        },
        error: () => this.router.navigate(['/login']),
      });
    });
  }

  initForm(user: User) {
    let address = user.address;

    if (typeof address === 'string') {
      // Impossible d'accéder aux champs si c'est juste un IRI
      // Tu peux choisir de ne rien faire ou d'afficher une erreur
      console.error("L'addresse est une IRI, pas un objet complet");
      return;
    }

    this.profileForm = this.fb.group({
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      pseudo: [user.pseudo, Validators.required],
      gender: [user.gender, Validators.required],
      birthdate: [user.birthdate?.split('T')[0], Validators.required], // format date
      email: [user.email, [Validators.required, Validators.email]],

      // Champs addresse (user.address peut être null)
      street: [address.street || '', Validators.required],
      city: [address.city || '', Validators.required],
      postalCode: [address.postalCode || '', Validators.required],
      region: [address.region || '', Validators.required],
      country: [address.country || '', Validators.required],
    });
  }

  onSave() {
    if (!this.profileForm.valid || !this.user || !this.user.address) return;

    let address = this.user.address;

    if (typeof address === 'string') {
      // Impossible d'accéder aux champs si c'est juste un IRI
      // Tu peux choisir de ne rien faire ou d'afficher une erreur
      console.error("L'addresse est une IRI, pas un objet complet");
      return;
    }

    const formValue = this.profileForm.value;

    const updatedaddress = {
      ...this.address,
      street: formValue.street,
      city: formValue.city,
      postalCode: formValue.postalCode,
      region: formValue.region,
      country: formValue.country,
    };

    // Mise à jour de l'addresse
    this.addressService
      .updateaddress(`/api/addresses/${address.id}`, updatedaddress)
      .subscribe({
        next: () => {
          const updatedUser = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            pseudo: formValue.pseudo,
            gender: formValue.gender,
            birthdate: new Date(formValue.birthdate).toISOString(),
            email: formValue.email,
            address: `/api/addresses/${address.id}`, // IRI, pas objet !
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
        error: () => alert("Erreur lors de la mise à jour de l'addresse"),
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
