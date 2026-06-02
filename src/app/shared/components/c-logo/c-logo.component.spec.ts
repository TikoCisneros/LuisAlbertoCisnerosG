import { render, screen } from '@testing-library/angular';
import { CLogoComponent } from './c-logo.component';
import { describe, it, expect } from 'vitest';

describe('Preubas de CLogoComponent', () => {
  it('deberia renderizar fallback si no posee src', async () => {
    await render(CLogoComponent, {
      inputs: {
        fallbackName: 'Smart Watch',
        src: null,
      },
    });

    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('SM')).toBeDefined();
  });

  it('deberia renderizar la imagen', async () => {
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

  it('deberia renderizar el falback si falla la carga de imagen', async () => {
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
