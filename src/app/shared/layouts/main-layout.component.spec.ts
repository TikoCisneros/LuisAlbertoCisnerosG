import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { describe, it, expect } from 'vitest';

@Component({ standalone: true, template: '' })
class DummyComponent {}

describe('Pruebas de MainLayoutComponent', () => {
  it('deberia renderizar correctamente', async () => {
    await render(MainLayoutComponent, {
      providers: [provideRouter([{ path: 'products', component: DummyComponent }])],
    });

    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByText('BANCO')).toBeDefined();
  });

  it('deberia funcionar correctamente la funcionalidad de Volver', async () => {
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
