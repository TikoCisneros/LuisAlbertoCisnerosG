import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { BASE_URL } from '@core/services/api-url.token';
import { Product, ProductErrors } from '@domains/products/domain/models/product-model';
import {
  ProductDTO,
  ProductsApiErrorsDTO,
  ProductsApiResponseDTO,
} from '@domains/products/data-access/dtos/product.dto';
import { ProductMapper } from '@domains/products/domain/mappers/product.mapper';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';

@Injectable()
export class ProductHttpRepository implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);
  private readonly productURL = `${this.baseUrl}/products`;

  /**
   * Helper function used to extract the error message, from the HttpErrorResponse.
   */
  private extractErrorMessage(err: HttpErrorResponse): string {
    return (err.error as ProductsApiErrorsDTO)?.message || err.message || 'Error desconocido';
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductsApiResponseDTO>(this.productURL).pipe(
      map(({ data }) => ProductMapper.dtosToDomainList(data)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new ProductErrors('FETCH_FAILED', this.extractErrorMessage(err)));
      }),
    );
  }
  createProduct(product: Product): Observable<Product> {
    return this.http
      .post<ProductDTO>(this.productURL, ProductMapper.domainToDto(product))
      .pipe(map((dto) => ProductMapper.dtoToDomain(dto)));
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http
      .put<ProductDTO>(`${this.productURL}/${product.id}`, ProductMapper.domainToDto(product))
      .pipe(map((dto) => ProductMapper.dtoToDomain(dto)));
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete(`${this.productURL}/${productId}`, { responseType: 'text' }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new ProductErrors('DELETE_FAILED', this.extractErrorMessage(err)));
      }),
    );
  }

  verifyProductIDExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.productURL}/verification/${id}`);
  }
}
