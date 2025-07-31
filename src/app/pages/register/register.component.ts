import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdressService } from '../../services/adress.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private adressService = inject(AdressService);
  private router = inject(Router);

  private adressUri = '/api/adresses/204';

  registerForm: FormGroup = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    pseudo: ['', Validators.required],
    gender: ['male', Validators.required],
    birthdate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['coliver', Validators.required],
    // Champs adresse
    street: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    region: ['', Validators.required],
    country: ['', Validators.required],
  });

  error = '';
  success = false;

  onSubmit() {
    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.value;

    // Création de l'adresse d'abord
    this.adressService
      .createAdress({
        street: formValue.street,
        city: formValue.city,
        postalCode: formValue.postalCode,
        region: formValue.region,
        country: formValue.country,
        latitude: 0,
        longitude: 0,
        // latitude et longitude optionnels, tu peux les ajouter si tu as
      })
      .subscribe({
        next: (adressCreated) => {
          const adressUri = adressCreated['@id'];

          const payload = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            pseudo: formValue.pseudo,
            gender: formValue.gender,
            birthdate: new Date(formValue.birthdate).toISOString(),
            email: formValue.email,
            password: formValue.password,
            roles:
              formValue.role === 'coliver' ? ['ROLE_USER'] : ['ROLE_OWNER'],
            adress: adressUri,
          };
          console.log('Payload user:', payload);

          this.authService.register(payload).subscribe({
            next: () => {
              this.success = true;
              setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
              this.error =
                "Erreur lors de l'inscription : " +
                (err.error?.message || err.message);
            },
          });
        },
        error: (err) => {
          this.error =
            "Erreur lors de la création de l'adresse : " +
            (err.error?.message || err.message);
        },
      });
  }
}
