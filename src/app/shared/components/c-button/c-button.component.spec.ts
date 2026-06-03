import { userEvent } from 'storybook/test';
import { render, screen } from '@testing-library/angular';
import { vi, describe, it, expect } from 'vitest';
import { CButtonComponent } from './c-button.component';

describe('CButtonComponent', () => {
  it('should render with primary variant by default', async () => {
    await render(CButtonComponent);

    const button = screen.getByRole('button');
    expect(button.classList.contains('c-button--primary')).toBe(true);
  });

  it('should change to secondary variant when specified', async () => {
    await render(CButtonComponent, {
      inputs: {
        variant: 'secondary',
      },
    });

    const button = screen.getByRole('button');
    expect(button.classList.contains('c-button--secondary')).toBe(true);
  });

  it('should be disabled when isDisabled input is true', async () => {
    await render(CButtonComponent, {
      inputs: {
        isDisabled: true,
      },
    });

    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('should trigger onClick output when clicked', async () => {
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

  it('should display a loading spinner and prevent click events when isLoading is true', async () => {
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
