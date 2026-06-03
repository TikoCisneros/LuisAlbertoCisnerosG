import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BASE_URL } from '@core/services/api-url.token';
import { Product } from '@domains/products/bussiness/models/product-model';
import { ProductDTO, ProductsApiResponseDTO } from '@domains/products/data-access/dtos/product.dto';
import { ProductMapper } from '@domains/products/bussiness/mappers/product.mapper';

@Injectable()
export class ProductHttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BASE_URL);
  private readonly productURL = `${this.baseUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsApiResponseDTO>(this.productURL)
      .pipe(map(({ data }) => ProductMapper.dtosToDomainList(data)));
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

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.productURL}/${productId}`);
  }

  verifyProductIDExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.productURL}/verification/${id}`);
  }
}
