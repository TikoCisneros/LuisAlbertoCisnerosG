import { Routes } from '@angular/router';
import { ProductHttpRepository } from '@domains/products/data-access/repositories/product-http.repository';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () => import('./domains/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
    providers: [
      {
        provide: ProductRepository,
        useClass: ProductHttpRepository,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
