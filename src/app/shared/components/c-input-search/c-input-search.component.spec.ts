import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CInputSearchComponent } from './c-input-search.component';
import { vi, describe, it, expect } from 'vitest';

describe('CInputSearchComponent', () => {
  it('should render input with correct placeholder and value', async () => {
    await render(CInputSearchComponent, {
      inputs: {
        placeholder: 'Search product...',
        value: 'Apple',
      },
    });

    const inputEl = screen.getByPlaceholderText('Search product...') as HTMLInputElement;
    expect(inputEl).toBeDefined();
    expect(inputEl.value).toBe('Apple');
  });

  it('should emit valueChange when user types', async () => {
    const valueChangeSpy = vi.fn();

    await render(CInputSearchComponent, {
      on: {
        onValueChange: valueChangeSpy,
      },
    });

    const user = userEvent.setup();
    const inputEl = screen.getByRole('textbox');
    await user.type(inputEl, 'B');

    expect(valueChangeSpy).toHaveBeenCalledWith('B');
  });

  it('should show clear button only when value is present and not disabled', async () => {
    const { fixture } = await render(CInputSearchComponent, {
      inputs: {
        value: '',
      },
    });

    // Sin valor: no debe haber botón de limpiar
    expect(screen.queryByRole('button', { name: /clear search/i })).toBeNull();

    // Con valor: debe aparecer el botón
    fixture.componentRef.setInput('value', 'Banana');
    fixture.detectChanges();
    expect(screen.getByRole('button', { name: /clear search/i })).toBeDefined();
  });

  it('should emit empty string when clear button is clicked', async () => {
    const valueChangeSpy = vi.fn();

    await render(CInputSearchComponent, {
      inputs: {
        value: 'Banana',
      },
      on: {
        onValueChange: valueChangeSpy,
      },
    });

    const user = userEvent.setup();
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearBtn);

    expect(valueChangeSpy).toHaveBeenCalledWith('');
  });
});
