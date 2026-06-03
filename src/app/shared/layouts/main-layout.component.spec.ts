import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { describe, it, expect } from 'vitest';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('MainLayoutComponent', () => {
  it('should render the layout successfully', async () => {
    await render(MainLayoutComponent, {
      providers: [provideRouter([{ path: 'products', component: DummyComponent }])],
    });

    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByText('BANCO')).toBeDefined();
  });

  it('should display the back navigation button appropriately based on the current route', async () => {
    const { navigate } = await render(MainLayoutComponent, {
      providers: [
        provideRouter([
          { path: 'products', component: DummyComponent },
          { path: 'products/add', component: DummyComponent },
        ]),
      ],
    });

    await navigate('products');
    expect(screen.queryByRole('link', { name: /volver/i })).toBeNull();

    await navigate('products/add');
    const backLink = screen.getByRole('link', { name: /volver/i });
    expect(backLink).toBeDefined();
    expect(backLink.getAttribute('href')).toBe('/products');
  });
});
