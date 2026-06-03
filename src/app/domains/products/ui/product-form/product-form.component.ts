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
    logo: ['', [Validators.required]],
    releaseDate: ['', [Validators.required, futureOrTodayValidator()]],
    revisionDate: [{ value: '', disabled: true }, [Validators.required]],
  });

  ngOnInit(): void {
    const product = this.initialValues();
    if (product) {
      this.fillForm(product);
    }
    // Listen releaseDate changes
    this.setupDateSync();
    // Add ID validator
    this.setupIdValidator();
  }

  private fillForm(product: Product) {
    const { id, name, description, logoURL: logo, releaseDate, revisionDate } = product;
    this.productForm.patchValue({
      id,
      name,
      description,
      logo,
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
