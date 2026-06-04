import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../../domain/models/product-model';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class UpdateProductUseCase {
  private readonly repository = inject(ProductRepository);

  execute(product: Product): Observable<ProductResponse> {
    return this.repository.updateProduct(product);
  }
}
