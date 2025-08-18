import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.css',
})
export class MyListingsComponent {}
