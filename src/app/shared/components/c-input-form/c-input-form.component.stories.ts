import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CInputFormComponent } from './c-input-form.component';

@Component({
  selector: 'c-input-form-wrapper',
  standalone: true,
  imports: [ReactiveFormsModule, CInputFormComponent],
  template: `
    <div style="max-width: 400px; padding: 20px;">
      <c-input-form
        [placeholder]="placeholder"
        [type]="type"
        [id]="id"
        [label]="label"
        [isInvalid]="isInvalid"
        [errorMessage]="errorMessage"
        [formControl]="control"
      ></c-input-form>
    </div>
  `,
})
class CInputFormWrapperComponent implements OnChanges {
  @Input() placeholder = '';
  @Input() type: 'text' | 'date' = 'text';
  @Input() id = '';
  @Input() label = '';
  @Input() isInvalid = false;
  @Input() errorMessage = '';
  @Input() value = '';
  @Input() disabled = false;

  control = new FormControl('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.control.setValue(this.value, { emitEvent: false });
    }
    if (changes['disabled']) {
      if (this.disabled) {
        this.control.disable({ emitEvent: false });
      } else {
        this.control.enable({ emitEvent: false });
      }
    }
  }
}

const meta: Meta<CInputFormWrapperComponent> = {
  title: 'Input Form UI Component',
  component: CInputFormWrapperComponent,
};

export default meta;

type Story = StoryObj<CInputFormWrapperComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Ingresa el nombre del producto...',
    type: 'text',
    id: 'product-name',
    label: 'Nombre del Producto',
    value: '',
    disabled: false,
    isInvalid: false,
    errorMessage: '',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Ingresa el nombre del producto...',
    type: 'text',
    id: 'product-name',
    label: 'Nombre del Producto',
    value: 'iPhone 15 Pro',
    disabled: false,
    isInvalid: false,
    errorMessage: '',
  },
};

export const DateType: Story = {
  args: {
    placeholder: 'Selecciona una fecha...',
    type: 'date',
    id: 'release-date',
    label: 'Fecha de Lanzamiento',
    value: '',
    disabled: false,
    isInvalid: false,
    errorMessage: '',
  },
};

export const Invalid: Story = {
  args: {
    placeholder: 'Ingresa el nombre del producto...',
    type: 'text',
    id: 'product-name',
    label: 'Nombre del Producto',
    value: '',
    disabled: false,
    isInvalid: true,
    errorMessage: 'El nombre del producto es obligatorio.',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Ingresa el nombre del producto...',
    type: 'text',
    id: 'product-name',
    label: 'Nombre del Producto',
    value: 'Texto deshabilitado',
    disabled: true,
    isInvalid: false,
    errorMessage: '',
  },
};
