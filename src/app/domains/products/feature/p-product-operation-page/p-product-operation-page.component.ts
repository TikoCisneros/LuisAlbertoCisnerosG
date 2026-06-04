import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { uniqueProductIdValidator } from '@domains/products/validators/product-id.validator';
import { ProductFormComponent } from '@domains/products/ui/product-form/product-form.component';
import { ProductStore } from '@domains/products/domain/state/product.store';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '@domains/products/domain/models/product-model';
import { ProductHttpRepository } from '@domains/products/data-access/repositories/product-http.repository';

@Component({
  selector: 'p-product-operation-page',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './p-product-operation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductOperationPageComponent implements OnInit {
  private readonly _productRepository = inject(ProductRepository);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute); // Inyectamos la ruta activa

  readonly store = inject(ProductStore);
  readonly idValidator = uniqueProductIdValidator(this._productRepository);

  // Signals para controlar el modo edición y el ID
  readonly productId = signal<string | null>(null);
  readonly isEditMode = computed(() => !!this.productId());

  // Buscar reactivamente el producto en el Store cuando cambie
  readonly productToEdit = computed(() => {
    const id = this.productId();
    if (!id) return null;
    return this.store.products().find((p) => p.id === id) || null;
  });

  // Auxiliar para controlar la redirección
  private readonly _isSubmitting = signal(false);

  constructor() {
    effect(() => {
      if (this._isSubmitting() && !this.store.isLoading() && !this.store.hasError()) {
        this._router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.productId.set(id);
      // Si entramos directo a editar por URL y la lista está vacía en el store, cargamos los productos
      if (this.store.products().length === 0) {
        this.store.loadProducts();
      }
    }
  }

  onSubmitProduct(product: Product): void {
    this._isSubmitting.set(true);
    if (this.isEditMode()) {
      this.store.updateProduct(product);
      return;
    }
    this.store.addProduct(product);
  }
}
