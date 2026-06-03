import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CModalComponent } from './c-modal.component';
import { vi, describe, it, expect } from 'vitest';

describe('CModalComponent', () => {
  it('should not render anything when isOpen is false', async () => {
    const { container } = await render(CModalComponent, {
      inputs: { isOpen: false },
    });

    expect(container.querySelector('.c-modal-overlay')).toBeNull();
  });

  it('should render details correctly when isOpen is true', async () => {
    await render(CModalComponent, {
      inputs: {
        isOpen: true,
        bodyText: '¿Seguro de eliminar?',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    });

    expect(screen.getByText('¿Seguro de eliminar?')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDefined();
  });

  it('should emit onCancel output when Cancel button is clicked', async () => {
    const onCancelSpy = vi.fn();

    await render(CModalComponent, {
      inputs: {
        isOpen: true,
        cancelText: 'Cancel',
      },
      on: {
        onCancel: onCancelSpy,
      },
    });

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelBtn);

    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should emit onConfirm output when Confirm button is clicked', async () => {
    const onConfirmSpy = vi.fn();

    await render(CModalComponent, {
      inputs: {
        isOpen: true,
        confirmText: 'Confirm',
      },
      on: {
        onConfirm: onConfirmSpy,
      },
    });

    const user = userEvent.setup();
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    await user.click(confirmBtn);

    expect(onConfirmSpy).toHaveBeenCalled();
  });

  it('should emit onCancel output when overlay is clicked and not loading', async () => {
    const onCancelSpy = vi.fn();

    const { container } = await render(CModalComponent, {
      inputs: {
        isOpen: true,
        isLoading: false,
      },
      on: {
        onCancel: onCancelSpy,
      },
    });

    const user = userEvent.setup();
    const overlay = container.querySelector('.c-modal-overlay') as HTMLElement;
    await user.click(overlay);

    expect(onCancelSpy).toHaveBeenCalled();
  });

  describe('loading state', () => {
    it('should disable action buttons and block overlay click', async () => {
      const onCancelSpy = vi.fn();

      const { container } = await render(CModalComponent, {
        inputs: {
          isOpen: true,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          isLoading: true,
        },
        on: {
          onCancel: onCancelSpy,
        },
      });

      const cancelBtn = screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement;
      const confirmBtn = container.querySelector('c-button[variant="primary"] button') as HTMLButtonElement;

      expect(cancelBtn.disabled).toBe(true);
      expect(confirmBtn.disabled).toBe(true);

      const user = userEvent.setup();
      const overlay = container.querySelector('.c-modal-overlay') as HTMLElement;
      await user.click(overlay);

      expect(onCancelSpy).not.toHaveBeenCalled();
    });
  });
});
