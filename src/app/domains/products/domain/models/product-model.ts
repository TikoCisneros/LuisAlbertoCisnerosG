export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logoURL: string;
  readonly releaseDate: Date;
  readonly revisionDate: Date;
}

export interface ProductResponse {
  readonly message: string;
  readonly data: Product;
}

export class ProductErrors extends Error {
  constructor(
    public readonly code: 'FETCH_FAILED' | 'CREATE_FAILED' | 'DELETE_FAILED' | 'UPDATE_FAILED',
    message: string,
  ) {
    super(message);
    this.name = 'ProductDomainErrors';
  }
}
