import { CButtonComponent } from '@shared/components/c-button/c-button.component';
import { CInputFormComponent } from '@shared/components/c-input-form/c-input-form.component';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  OnInit,
  DestroyRef,
  effect,
} from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '@domains/products/domain/models/product-model';
import { addOneYear, getTodayMidnight, toInputDateFormat } from '@shared/utils/date.utils';
import { futureOrTodayValidator } from '@domains/products/validators/date.validator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [CInputFormComponent, CButtonComponent, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  readonly minDate = toInputDateFormat(getTodayMidnight());
  private readonly destroyRef = inject(DestroyRef);
  // Input props
  isEditMode = input<boolean>(false);
  initialValues = input<Product | null>(null);
  isLoading = input<boolean>(false);
  idValidator = input<AsyncValidatorFn | null>(null);

  // Output events
  onSubmit = output<Product>();

  readonly productForm: FormGroup = this._formBuilder.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logoURL: ['', [Validators.required]],
    releaseDate: ['', [Validators.required, futureOrTodayValidator()]],
    revisionDate: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const product = this.initialValues();
      if (product) {
        this.fillForm(product);
      }
    });
  }

  ngOnInit(): void {
    // Listen releaseDate changes
    this.setupDateSync();
    // Add ID validator
    this.setupIdValidator();
  }

  // Para la edición
  get hasValuesChanges(): boolean {
    const original = this.initialValues();
    if (!original) {
      return true;
    }

    const current = this.productForm.getRawValue();
    return (
      current.name !== original.name ||
      current.description !== original.description ||
      current.logoURL !== original.logoURL ||
      current.releaseDate !== toInputDateFormat(original.releaseDate)
    );
  }

  resetForm() {
    if (this.isEditMode()) {
      const product = this.initialValues();
      if (product) {
        this.fillForm(product);
      }
      return;
    }
    this.productForm.reset();
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control || !control.errors) return '';
    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido.';
    if (errors['minlength'])
      return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength'])
      return `Debe tener como máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['invalidDate']) return 'La fecha debe ser igual o posterior al día de hoy.';
    if (errors['idExists']) return 'ID no válido!';
    return 'Campo inválido.';
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmitHandler() {
    if (!this.productForm.valid) return;
    this.onSubmit.emit(this.productForm.getRawValue() as Product);
  }

  private fillForm(product: Product) {
    const { id, name, description, logoURL, releaseDate, revisionDate } = product;
    this.productForm.patchValue({
      id,
      name,
      description,
      logoURL,
      releaseDate: toInputDateFormat(releaseDate),
      revisionDate: toInputDateFormat(revisionDate),
    });

    if (this.isEditMode()) {
      this.productForm.get('id')?.disable();
    }
  }

  private setupDateSync(): void {
    const releaseControl = this.productForm.get('releaseDate');
    const revisionControl = this.productForm.get('revisionDate');
    if (releaseControl && revisionControl) {
      releaseControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value: string) => {
          if (value && releaseControl.valid) {
            revisionControl.setValue(addOneYear(value), { emitEvent: false });
          }
        });
    }
  }

  private setupIdValidator() {
    const validator = this.idValidator();
    if (validator) {
      this.productForm.get('id')?.setAsyncValidators(validator);
    }
  }
}
