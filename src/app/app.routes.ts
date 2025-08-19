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
import { MyListingsComponent } from './pages/my-listings/my-listings.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'listings', component: ListingsComponent },

  { path: 'listing/new', component: ListingCreateComponent },
  { path: 'listing/edit/:id', component: ListingEditComponent },
  { path: 'listing/:id', component: ListingDetailsComponent },

  { path: 'mylistings', component: MyListingsComponent },
  { path: 'mybookings', component: MyBookingsComponent },
  { path: '**', redirectTo: '' },
];
