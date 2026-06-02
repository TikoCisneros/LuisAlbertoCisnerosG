import { userEvent } from 'storybook/test';
import { render, screen } from '@testing-library/angular';
import { vi, describe, it, expect } from 'vitest';
import { CButtonComponent } from './c-button.component';

describe('Componente CButtonComponent', () => {
  it('debería tener la apariencia primaria por defecto', async () => {
    await render(CButtonComponent);

    const button = screen.getByRole('button');
    expect(button.classList.contains('c-button--primary')).toBe(true);
  });

  it('debería cambiar su apariencia a secundaria cuando se le indique', async () => {
    await render(CButtonComponent, {
      inputs: {
        variant: 'secondary',
      },
    });

    const button = screen.getByRole('button');
    expect(button.classList.contains('c-button--secondary')).toBe(true);
  });

  it('debería estar deshabilitado en el navegador cuando se activa la propiedad isDisabled', async () => {
    await render(CButtonComponent, {
      inputs: {
        isDisabled: true,
      },
    });

    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('debería hacerle clic correctamente', async () => {
    const clickHandler = vi.fn();

    await render(CButtonComponent, {
      componentProperties: {
        onClick: {
          emit: clickHandler,
        } as any,
      },
    });

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar el indicador de carga y bloquear cualquier intento de clic', async () => {
    const clickHandler = vi.fn();

    await render(CButtonComponent, {
      componentInputs: {
        isLoading: true,
      },
      componentProperties: {
        onClick: {
          emit: clickHandler,
        },
      } as any,
    });

    const button = screen.getByRole('button');

    expect(button.querySelector('.c-button__spinner')).not.toBeNull();

    const user = userEvent.setup();
    await user.click(button);
    expect(clickHandler).toHaveBeenCalledTimes(0);
  });
});
