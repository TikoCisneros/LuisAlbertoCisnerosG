import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../models/product-model';
import { ProductsApiErrorsDTO } from '@domains/products/data-access/dtos/product.dto';
import { ProductHttpService } from '@domains/products/data-access/services/product-http.service';

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  /** Stores error messages */
  error: string | null;
  /** Search section */
  searchTerm: string;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  searchTerm: '',
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
  // Methods
  withMethods((store, httpService = inject(ProductHttpService)) => ({
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
    // Filter functionality
    setSearchTerm(searchTerm: string) {
      patchState(store, { searchTerm });
    },
  })),
);
