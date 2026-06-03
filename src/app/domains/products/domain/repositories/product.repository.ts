import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product-model';

export abstract class ProductRepository {
  abstract getProducts(): Observable<Product[]>;
  abstract createProduct(product: Product): Observable<ProductResponse>;
  abstract updateProduct(product: Product): Observable<ProductResponse>;
  abstract deleteProduct(productId: string): Observable<string>;
  abstract verifyProductIDExists(id: string): Observable<boolean>;
}
