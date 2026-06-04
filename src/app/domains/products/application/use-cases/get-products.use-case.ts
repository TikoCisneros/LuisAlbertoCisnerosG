import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../domain/models/product-model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class GetProductsUseCase {
  private readonly repository = inject(ProductRepository);

  execute(): Observable<Product[]> {
    return this.repository.getProducts();
  }
}
