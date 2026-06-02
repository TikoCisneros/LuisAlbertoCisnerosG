import { render, screen } from '@testing-library/angular';
import { CHeaderComponent } from './c-header.component';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';

describe('Pruebas de CHeaderComponent', () => {
  it('deberia renderizar correctamente con el logo y texto', async () => {
    await render(CHeaderComponent, {
      providers: [provideRouter([])],
    });

    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByText('BANCO')).toBeDefined();
  });

  it('deberia tener la ruta de navegacion hacia atras correcta', async () => {
    await render(CHeaderComponent, {
      inputs: {
        backUrl: '/products',
      },
      providers: [provideRouter([])],
    });

    const backLink = screen.getByRole('link', { name: /volver/i });
    expect(backLink).toBeDefined();
    expect(backLink.getAttribute('href')).toBe('/products');
  });
});
