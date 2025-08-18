import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
export class ListingFormComponent implements OnInit {
  @Input() initialData: any = null;
  @Output() formSubmit = new EventEmitter<any>();

  listingForm!: FormGroup;
  servicesList: any[] = [];
  equipmentList: any[] = [];

  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);

  ngOnInit(): void {
    this.listingForm = this.fb.group({
      title: [this.initialData?.title || '', Validators.required],
      description: [this.initialData?.description || '', Validators.required],
      price: [
        this.initialData?.price || '',
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
      services: [this.initialData?.services || []],
      equipment: [this.initialData?.equipment || []],
    });

    this.listingService.getServices().subscribe((res: any) => {
      this.servicesList = res['member'] || [];
    });

    this.listingService.getEquipments().subscribe((res: any) => {
      this.equipmentList = res['member'] || [];
    });
  }

  onSubmit(): void {
    if (this.listingForm.valid) {
      this.formSubmit.emit(this.listingForm.value);
    }
  }

  toggleSelection(controlName: 'services' | 'equipment', id: string) {
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

  isSelected(controlName: 'services' | 'equipment', id: string): boolean {
    const current =
      (this.listingForm.get(controlName)?.value as string[]) || [];
    return current.includes(id);
  }
}
