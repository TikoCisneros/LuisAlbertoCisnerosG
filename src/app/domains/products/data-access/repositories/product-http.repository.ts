import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { BASE_URL } from '@core/services/api-url.token';
import {
  Product,
  ProductErrors,
  ProductResponse,
} from '@domains/products/domain/models/product-model';
import {
  ProductDTO,
  ProductsApiErrorsDTO,
  ProductsApiResponseDTO,
  ProductsApiSuccessDTO,
} from '@domains/products/data-access/dtos/product.dto';
import { ProductMapper } from '@domains/products/domain/mappers/product.mapper';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { httpErrorMessageParser } from '@shared/utils/http-error.utils';

@Injectable()
export class ProductHttpRepository implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);
  private readonly productURL = `${this.baseUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<ProductsApiResponseDTO>(this.productURL).pipe(
      map(({ data }) => ProductMapper.dtosToDomainList(data)),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new ProductErrors('FETCH_FAILED', httpErrorMessageParser(err)));
      }),
    );
  }
  createProduct(product: Product): Observable<ProductResponse> {
    return this.http
      .post<ProductsApiSuccessDTO>(this.productURL, ProductMapper.domainToDto(product))
      .pipe(
        map(({ message, data }) => ({
          message,
          data: ProductMapper.dtoToDomain(data!),
        })),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new ProductErrors('CREATE_FAILED', httpErrorMessageParser(err)));
        }),
      );
  }

  updateProduct(product: Product): Observable<ProductResponse> {
    return this.http
      .put<ProductsApiSuccessDTO>(
        `${this.productURL}/${product.id}`,
        ProductMapper.domainToDto(product),
      )
      .pipe(
        map(({ message, data }) => ({
          message,
          data: ProductMapper.dtoToDomain(data!),
        })),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new ProductErrors('UPDATE_FAILED', httpErrorMessageParser(err)));
        }),
      );
  }

  deleteProduct(productId: string): Observable<string> {
    return this.http.delete<ProductsApiSuccessDTO>(`${this.productURL}/${productId}`).pipe(
      map((res) => res.message),
      catchError((err: HttpErrorResponse) => {
        return throwError(() => new ProductErrors('DELETE_FAILED', httpErrorMessageParser(err)));
      }),
    );
  }

  verifyProductIDExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.productURL}/verification/${id}`);
  }
}
