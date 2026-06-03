export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logoURL: string;
  readonly releaseDate: Date;
  readonly revisionDate: Date;
}

export class ProductErrors extends Error {
  constructor(
    public readonly code: 'FETCH_FAILED' | 'CREATE_FAILED' | 'DELETE_FAILED',
    message: string,
  ) {
    super(message);
    this.name = 'ProductDomainErrors';
  }
}
