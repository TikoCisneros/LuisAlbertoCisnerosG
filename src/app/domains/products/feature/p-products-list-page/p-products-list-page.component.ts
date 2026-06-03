import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CInputSearchComponent } from '@shared/components/c-input-search/c-input-search.component';
import { CButtonComponent } from '@shared/components/c-button/c-button.component';
import { TableColumn } from '@shared/components/c-table/c-table.interface';
import { Product } from '@domains/products/domain/models/product-model';
import { CTableComponent } from '@shared/components/c-table/c-table.component';
import { ProductStore } from '@domains/products/domain/state/product.store';
import { ProductHttpRepository } from '@domains/products/data-access/repositories/product-http.repository';
import { CPaginationComponent } from '@shared/components/c-pagination/c-pagination.component';
import { CModalComponent } from '@shared/components/c-modal/c-modal.component';
import { Router } from '@angular/router';

const PRODUCT_TABLE_COLUMNS: TableColumn<Product>[] = [
  { key: 'logoURL', header: 'Logo', type: 'image' },
  { key: 'name', header: 'Nombre del producto' },
  { key: 'description', header: 'Descripción' },
  { key: 'releaseDate', header: 'Fecha de liberación', type: 'date' },
  { key: 'revisionDate', header: 'Fecha de reestructuración', type: 'date' },
];

@Component({
  selector: 'p-products-list-page',
  standalone: true,
  imports: [
    CInputSearchComponent,
    CButtonComponent,
    CTableComponent,
    CPaginationComponent,
    CModalComponent,
  ],
  providers: [ProductStore, ProductHttpRepository],
  templateUrl: './p-products-list-page.component.html',
  styleUrl: './p-products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductsListPageComponent implements OnInit {
  private readonly _router = inject(Router);
  readonly store = inject(ProductStore);
  readonly tableColumns = PRODUCT_TABLE_COLUMNS;

  productToDelete = signal<Product | null>(null);
  isDeleting = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isDeleting() && !this.store.isLoading()) {
        this.onCloseModal();
      }
    });
  }

  ngOnInit() {
    if (this.store.products().length === 0) {
      this.store.loadProducts();
    }
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete.set(product);
  }

  onDeleteProductConfirm() {
    const product = this.productToDelete();
    if (product) {
      this.isDeleting.set(true);
      this.store.deleteProduct(product.id);
    }
  }

  onCloseModal() {
    this.productToDelete.set(null);
    this.isDeleting.set(false);
  }

  onAddProduct() {
    this._router.navigate(['/products/add']);
  }
}
