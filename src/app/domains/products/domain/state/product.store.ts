import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product-model';
import { ProductsApiErrorsDTO } from '@domains/products/data-access/dtos/product.dto';
import { ProductHttpRepository } from '@domains/products/data-access/repositories/product-http.repository';

const INITIAL_PAGE = 1 as const;
const DEFAULT_TOTAL_PAGES = 1 as const;
const PAGE_SIZE = 5 as const;
export interface ProductState {
  products: Product[];
  isLoading: boolean;
  /** Stores error messages */
  error: string | null;
  /** Search section */
  searchTerm: string;
  /** Pagination section */
  currentPage: number;
  pageSize: number;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  currentPage: INITIAL_PAGE,
  pageSize: PAGE_SIZE,
};

/**
 * Helper function used to extract the error message, from the HttpErrorResponse.
 */
const getErrorMessage = (err: HttpErrorResponse, fallback: string): string => {
  return (err.error as ProductsApiErrorsDTO)?.message || fallback;
};

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
  withMethods((store, httpService = inject(ProductHttpRepository)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { error: null, isLoading: true })),
        switchMap(() =>
          httpService.getProducts().pipe(
            tap((products) => {
              patchState(store, { products, isLoading: false });
            }),
            catchError((err: HttpErrorResponse) => {
              const errMsg = getErrorMessage(err, 'Error al cargar productos');
              patchState(store, { error: errMsg, isLoading: false });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    deleteProduct: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { error: null, isLoading: true })),
        switchMap((productId) =>
          httpService.deleteProduct(productId).pipe(
            tap(() => {
              patchState(store, {
                products: store.products().filter((p) => p.id !== productId),
                isLoading: false,
              });
            }),
            catchError((err: HttpErrorResponse) => {
              const errMsg = getErrorMessage(err, 'Error al eliminar producto');
              patchState(store, { error: errMsg, isLoading: false });
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
  })),
);
