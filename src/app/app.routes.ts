import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutComponent } from './pages/about/about.component';
import { ListingsComponent } from './pages/listings/listings.component';
import { ListingDetailsComponent } from './pages/listing-detail/listing-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ListingCreateComponent } from './pages/listing-create/listing-create.component';
import { ListingEditComponent } from './pages/listing-edit/listing-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'listing/:id', component: ListingDetailsComponent },
  { path: 'listings/new', component: ListingCreateComponent },
  { path: 'listings/:id/edit', component: ListingEditComponent },
  { path: '**', redirectTo: '' }, // Route wildcard pour 404
];
