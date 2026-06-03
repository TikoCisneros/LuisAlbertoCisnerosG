import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CInputSearchComponent } from '@shared/components/c-input-search/c-input-search.component';
import { CButtonComponent } from '@shared/components/c-button/c-button.component';
import { TableColumn } from '@shared/components/c-table/c-table.interface';
import { Product } from '@domains/products/business/models/product-model';
import { CTableComponent } from '@shared/components/c-table/c-table.component';
import { ProductStore } from '@domains/products/business/state/product.store';
import { ProductHttpService } from '@domains/products/data-access/services/product-http.service';

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
  imports: [CInputSearchComponent, CButtonComponent, CTableComponent],
  providers: [ProductStore, ProductHttpService],
  templateUrl: './p-products-list-page.component.html',
  styleUrl: './p-products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductsListPageComponent implements OnInit {
  readonly store = inject(ProductStore);
  readonly tableColumns = PRODUCT_TABLE_COLUMNS;

  ngOnInit() {
    if (this.store.products().length === 0) {
      this.store.loadProducts();
    }
  }
}
