import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/p-products-list-page/p-products-list-page.component').then(
        (m) => m.PProductsListPageComponent,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./feature/p-product-operation-page/p-product-operation-page.component').then(
        (m) => m.PProductOperationPageComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./feature/p-product-operation-page/p-product-operation-page.component').then(
        (m) => m.PProductOperationPageComponent,
      ),
  },
];
