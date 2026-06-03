import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CInputFormComponent } from './c-input-form.component';
import { describe, it, expect } from 'vitest';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CInputFormComponent],
  template: `
    <form [formGroup]="testForm">
      <c-input-form
        id="name"
        label="Nombre"
        placeholder="Introduce tu nombre"
        formControlName="name"
        [isInvalid]="isInvalid()"
        errorMessage="Nombre es requerido"
      ></c-input-form>
    </form>
  `,
})
class TestFormWrapperComponent {
  testForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.testForm = this.fb.group({
      name: [''],
    });
  }

  isInvalid(): boolean {
    const control = this.testForm.get('name');
    return !!(control && control.invalid && control.touched);
  }
}

describe('CInputFormComponent', () => {
  it('should render input field with labels and placeholder', async () => {
    await render(CInputFormComponent, {
      inputs: {
        id: 'user-input',
        label: 'Username',
        placeholder: 'Enter username',
      },
    });

    expect(screen.getByText('Username')).toBeDefined();
    const inputEl = screen.getByPlaceholderText('Enter username') as HTMLInputElement;
    expect(inputEl).toBeDefined();
    expect(inputEl.id).toBe('user-input');
  });

  it('should integrate with reactive form and update form value on typing', async () => {
    const { fixture } = await render(TestFormWrapperComponent);

    const user = userEvent.setup();
    const inputEl = screen.getByRole('textbox') as HTMLInputElement;

    // Escribir en el input
    await user.type(inputEl, 'Luis');

    // El valor del formulario debería estar actualizado
    const formValue = fixture.componentInstance.testForm.value;
    expect(formValue.name).toBe('Luis');
  });

  it('should display error message when invalid is true', async () => {
    await render(CInputFormComponent, {
      inputs: {
        label: 'Nombre',
        isInvalid: true,
        errorMessage: 'Nombre es requerido',
      },
    });

    expect(screen.getByText('Nombre es requerido')).toBeDefined();
  });

  it('should handle disabled state from control', async () => {
    const { fixture } = await render(TestFormWrapperComponent);
    fixture.componentInstance.testForm.get('name')?.disable();
    fixture.detectChanges();

    const inputEl = screen.getByRole('textbox') as HTMLInputElement;
    expect(inputEl.disabled).toBe(true);
  });

  it('should support date input type', async () => {
    const { container } = await render(CInputFormComponent, {
      inputs: {
        type: 'date',
      },
    });

    const inputEl = container.querySelector('input') as HTMLInputElement;
    expect(inputEl.type).toBe('date');
  });
});
