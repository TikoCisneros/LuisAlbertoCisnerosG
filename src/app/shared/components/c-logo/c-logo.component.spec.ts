import { render, screen } from '@testing-library/angular';
import { CLogoComponent } from './c-logo.component';
import { describe, it, expect } from 'vitest';

describe('CLogoComponent', () => {
  it('should render fallback initials when src is not provided', async () => {
    await render(CLogoComponent, {
      inputs: {
        fallbackName: 'Smart Watch',
        src: null,
      },
    });

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('SM')).toBeDefined();
  });

  it('should render the image when src is provided', async () => {
    await render(CLogoComponent, {
      inputs: {
        fallbackName: 'Smart Watch',
        src: 'https://example.com/logo.png',
      },
    });

    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('https://example.com/logo.png');
  });

  it('should fallback to initials when the image fails to load', async () => {
    const { fixture } = await render(CLogoComponent, {
      inputs: {
        fallbackName: 'Smart Watch',
        src: 'https://example.com/logo.png',
      },
    });

    fixture.componentInstance.onImgError();
    fixture.detectChanges();

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('SM')).toBeDefined();
  });
});
