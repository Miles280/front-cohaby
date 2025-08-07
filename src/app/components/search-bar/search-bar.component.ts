import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Equipment } from '../../../models/equipment.interface';
import { Service } from '../../../models/service.interface'; // à créer / ajuster si besoin
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  @Output() search: EventEmitter<any> = new EventEmitter();

  searchForm: FormGroup;
  showEquipments = false;
  availableEquipments: Equipment[] = [];
  selectedEquipments: string[] = [];

  showServices = false;
  availableServices: Service[] = [];
  selectedServices: string[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.searchForm = this.fb.group({
      location: [''],
      priceMax: [''],
      maxCapacity: [''],
    });
  }

  ngOnInit() {
    this.api.getAll('/api/equipment').subscribe({
      next: (data) => {
        this.availableEquipments = data['member'];
      },
    });

    // Charger les services aussi
    this.api.getAll('/api/services').subscribe({
      next: (data) => {
        this.availableServices = data['member'];
      },
    });
  }

  toggleEquipments() {
    this.showEquipments = !this.showEquipments;
  }

  toggleServices() {
    this.showServices = !this.showServices;
  }

  onEquipmentChange(event: Event, iri: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedEquipments.push(iri);
    } else {
      this.selectedEquipments = this.selectedEquipments.filter(
        (e) => e !== iri
      );
    }
  }

  removeEquipment(iri: string) {
    this.selectedEquipments = this.selectedEquipments.filter((e) => e !== iri);
  }

  getEquipmentName(iri: string): string {
    const eq = this.availableEquipments.find((e) => e['@id'] === iri);
    return eq?.name ?? 'Équipement inconnu';
  }

  onServiceChange(event: Event, iri: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedServices.push(iri);
    } else {
      this.selectedServices = this.selectedServices.filter((e) => e !== iri);
    }
  }

  removeService(iri: string) {
    this.selectedServices = this.selectedServices.filter((e) => e !== iri);
  }

  getServiceName(iri: string): string {
    const srv = this.availableServices.find((e) => e['@id'] === iri);
    return srv?.name ?? 'Service inconnu';
  }

  onSearch() {
    const formValues = this.searchForm.value;
    const query = {
      ...formValues,
      equipments: this.selectedEquipments
        .map(
          (id) => this.availableEquipments.find((e) => e['@id'] === id)?.name
        )
        .filter((name) => name !== undefined),
      services: this.selectedServices
        .map((id) => this.availableServices.find((e) => e['@id'] === id)?.name)
        .filter((name) => name !== undefined),
    };

    console.log('Recherche avec :', query);
    this.search.emit(query);
  }

  trackById(index: number, item: any) {
    return item['@id'];
  }
}
