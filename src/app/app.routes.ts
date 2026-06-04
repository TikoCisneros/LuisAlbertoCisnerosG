import { Routes } from '@angular/router';
import { CreateProductUseCase } from '@domains/products/application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '@domains/products/application/use-cases/delete-product.use-case';
import { GetProductsUseCase } from '@domains/products/application/use-cases/get-products.use-case';
import { UpdateProductUseCase } from '@domains/products/application/use-cases/update-product.use-case';
import { ProductHttpRepository } from '@domains/products/data-access/repositories/product-http.repository';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { ProductStore } from '@domains/products/domain/state/product.store';

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
      ProductStore, // Proveedor único (Singleton) para todas las rutas de productos
      {
        provide: ProductRepository,
        useClass: ProductHttpRepository,
      },
      // use cases
      GetProductsUseCase,
      CreateProductUseCase,
      UpdateProductUseCase,
      DeleteProductUseCase,
    ],
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
