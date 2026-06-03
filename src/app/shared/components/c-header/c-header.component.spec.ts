import { render, screen } from '@testing-library/angular';
import { CHeaderComponent } from './c-header.component';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';

describe('CHeaderComponent', () => {
  it('should render successfully with logo and text', async () => {
    await render(CHeaderComponent, {
      providers: [provideRouter([])],
    });

    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByText('BANCO')).toBeDefined();
  });

  it('should render the back navigation link with correct URL when backUrl is provided', async () => {
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
