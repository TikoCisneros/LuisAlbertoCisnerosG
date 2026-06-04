import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  private readonly repository = inject(ProductRepository);

  execute(id: string): Observable<string> {
    return this.repository.deleteProduct(id);
  }
}
