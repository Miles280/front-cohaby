import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-listing-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './listing-form.component.html',
  styleUrl: './listing-form.component.css',
})
export class ListingFormComponent implements OnInit, OnChanges {
  @Input() initialData: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  listingForm!: FormGroup;
  servicesList: any[] = [];
  equipmentsList: any[] = [];

  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);

  ngOnInit(): void {
    this.initForm();

    this.listingService.getServices().subscribe((res: any) => {
      this.servicesList = res['member'] || [];
    });

    this.listingService.getEquipments().subscribe((res: any) => {
      this.equipmentsList = res['member'] || [];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && this.listingForm) {
      this.listingForm.patchValue({
        ...this.initialData,
        services: this.initialData?.services?.map((s: any) => s['@id']) || [],
        equipments:
          this.initialData?.equipments?.map((e: any) => e['@id']) || [],
      });
    }
  }

  private initForm(): void {
    this.listingForm = this.fb.group({
      title: [this.initialData?.title || '', Validators.required],
      description: [this.initialData?.description || '', Validators.required],
      pricePerNight: [
        this.initialData?.pricePerNight || '',
        [Validators.required, Validators.min(0)],
      ],
      maxCapacity: [
        this.initialData?.maxCapacity || '',
        [Validators.required, Validators.min(1)],
      ],
      address: this.fb.group({
        street: [this.initialData?.address?.street || '', Validators.required],
        city: [this.initialData?.address?.city || '', Validators.required],
        postalCode: [
          this.initialData?.address?.postalCode || '',
          Validators.required,
        ],
        region: [this.initialData?.address?.region || '', Validators.required],
        country: [
          this.initialData?.address?.country || '',
          Validators.required,
        ],
      }),
      services: [this.initialData?.services?.map((s: any) => s['@id']) || []],
      equipments: [
        this.initialData?.equipments?.map((e: any) => e['@id']) || [],
      ],
    });
  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      this.formSubmit.emit(this.listingForm.value);
    }
  }

  toggleSelection(controlName: 'services' | 'equipments', id: string) {
    const current =
      (this.listingForm.get(controlName)?.value as string[]) || [];
    if (current.includes(id)) {
      this.listingForm
        .get(controlName)
        ?.setValue(current.filter((i) => i !== id));
    } else {
      this.listingForm.get(controlName)?.setValue([...current, id]);
    }
  }

  isSelected(controlName: 'services' | 'equipments', id: string): boolean {
    const current =
      (this.listingForm.get(controlName)?.value as string[]) || [];
    return current.includes(id);
  }
}
