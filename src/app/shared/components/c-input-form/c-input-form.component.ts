import { Component, input, signal, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'c-input-form',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CInputFormComponent),
      multi: true,
    },
  ],
  templateUrl: './c-input-form.component.html',
  styleUrl: './c-input-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CInputFormComponent implements ControlValueAccessor {
  // Configuración del input
  placeholder = input<string>('');
  type = input<'text' | 'date'>('text');
  id = input<string>('');
  label = input<string>('');
  isInvalid = input<boolean>(false);
  errorMessage = input<string>('');

  // Estado interno
  value = signal<string>('');
  isDisabled = signal<boolean>(false);

  // Funciones callback de ControlValueAccessor
  onChangeHandler: (value: string) => void = () => {};
  onTouchedHandler: () => void = () => {};
  onInputHandler(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.value.set(inputEl.value);
    this.onChangeHandler(inputEl.value);
  }

  // ControlValueAccessor interface implementation
  writeValue(value: string | null | undefined): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeHandler = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedHandler = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
