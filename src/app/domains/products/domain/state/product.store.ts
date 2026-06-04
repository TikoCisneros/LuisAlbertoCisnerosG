import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Product, ProductErrors } from '../models/product-model';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { NotificationService } from '@core/notifications/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GetProductsUseCase } from '@domains/products/application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '@domains/products/application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '@domains/products/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@domains/products/application/use-cases/delete-product.use-case';

const INITIAL_PAGE = 1 as const;
const DEFAULT_TOTAL_PAGES = 1 as const;
const PAGE_SIZE = 5 as const;
export interface ProductState {
  products: Product[];
  isLoading: boolean;
  /** Search section */
  searchTerm: string;
  /** Pagination section */
  currentPage: number;
  pageSize: number;
  /** Api error */
  hasError: boolean;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  searchTerm: '',
  currentPage: INITIAL_PAGE,
  pageSize: PAGE_SIZE,
  hasError: false,
};

function errorParser(error: unknown, fallback: string) {
  // Verificación estricta del tipo de error
  const errMsg = error instanceof ProductErrors ? error.message : fallback;
  return errMsg;
}

export const ProductStore = signalStore(
  withState(initialState),
  // Filtering
  withComputed(({ products, searchTerm }) => {
    const filteredProducts = computed(() => {
      const query = searchTerm().toLowerCase().trim();
      if (!query) return products();

      return products().filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query),
      );
    });
    return { filteredProducts };
  }),
  // For pagination
  withComputed(({ filteredProducts, currentPage, pageSize }) => {
    const paginatedProducts = computed(() => {
      const startIndex = (currentPage() - DEFAULT_TOTAL_PAGES) * pageSize();
      return filteredProducts().slice(startIndex, startIndex + pageSize());
    });
    const totalResults = computed(() => filteredProducts().length);

    const totalPages = computed(() => {
      return Math.ceil(totalResults() / pageSize()) || DEFAULT_TOTAL_PAGES;
    });
    return { paginatedProducts, totalResults, totalPages };
  }),
  // Methods
  withMethods(
    (
      store,
      getProductsUseCase = inject(GetProductsUseCase),
      createProductUseCase = inject(CreateProductUseCase),
      updateProductUseCase = inject(UpdateProductUseCase),
      deleteProductUseCase = inject(DeleteProductUseCase),
      notificationService = inject(NotificationService),
    ) => ({
      loadProducts: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            getProductsUseCase.execute().pipe(
              tap((products) => {
                patchState(store, { products, isLoading: false, hasError: false });
              }),
              catchError((err) => {
                const errMsg = errorParser(err, 'Error inesperado al cargar productos');
                patchState(store, { isLoading: false, hasError: true });
                notificationService.notify('error', errMsg);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      deleteProduct: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((productId) =>
            deleteProductUseCase.execute(productId).pipe(
              tap((msj) => {
                patchState(store, {
                  products: store.products().filter((p) => p.id !== productId),
                  isLoading: false,
                  hasError: false,
                });
                notificationService.notify('success', msj);
              }),
              catchError((err) => {
                const errMsg = errorParser(err, 'Error inesperado al eliminar productos');
                patchState(store, { isLoading: false, hasError: true });
                notificationService.notify('error', errMsg);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      addProduct: rxMethod<Product>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((newProduct) =>
            createProductUseCase.execute(newProduct).pipe(
              tap(({ message, data: createdProduct }) => {
                patchState(store, {
                  products: [...store.products(), createdProduct],
                  isLoading: false,
                  hasError: false,
                });
                notificationService.notify('success', message);
              }),
              catchError((err) => {
                const errMsg = errorParser(err, 'Error inesperado al crear producto');
                patchState(store, { isLoading: false, hasError: true });
                notificationService.notify('error', errMsg);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      updateProduct: rxMethod<Product>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((updatedProduct) =>
            updateProductUseCase.execute(updatedProduct).pipe(
              tap(({ message, data: responseProduct }) => {
                patchState(store, {
                  products: store
                    .products()
                    .map((p) => (p.id === responseProduct.id ? responseProduct : p)),
                  isLoading: false,
                  hasError: false,
                });
                notificationService.notify('success', message);
              }),
              catchError((err) => {
                const errMsg = errorParser(err, 'Error inesperado al actualizar producto');
                patchState(store, { isLoading: false, hasError: true });
                notificationService.notify('error', errMsg);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      // Filter functionality
      setSearchTerm(searchTerm: string) {
        patchState(store, { searchTerm, currentPage: INITIAL_PAGE });
      },
      // Pagination functionality
      setPageSize(pageSize: number): void {
        patchState(store, { pageSize, currentPage: INITIAL_PAGE });
      },
      setCurrentPage(currentPage: number): void {
        if (currentPage >= INITIAL_PAGE && currentPage <= store.totalPages()) {
          patchState(store, { currentPage });
        }
      },
    }),
  ),
);
