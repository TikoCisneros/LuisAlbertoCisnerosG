import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { uniqueProductIdValidator } from '@domains/products/validators/product-id.validator';
import { ProductFormComponent } from '@domains/products/ui/product-form/product-form.component';
import { ProductStore } from '@domains/products/domain/state/product.store';
import { Router } from '@angular/router';
import { Product } from '@domains/products/domain/models/product-model';

@Component({
  selector: 'p-product-operation-page',
  standalone: true,
  imports: [ProductFormComponent],
  providers: [ProductStore],
  templateUrl: './p-product-operation-page.component.html',
  styleUrl: './p-product-operation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductOperationPageComponent {
  private readonly _productRepository = inject(ProductRepository);
  private readonly _router = inject(Router);
  readonly idValidator = uniqueProductIdValidator(this._productRepository);
  readonly store = inject(ProductStore);
  // Auxiliar para controlar la redirección
  private readonly _isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this._isSubmitting() && !this.store.isLoading() && !this.store.hasError()) {
        this._router.navigate(['/']);
      }
    });
  }
  onAddProduct(product: Product): void {
    this._isSubmitting.set(true);
    this.store.addProduct(product);
  }
}
