export interface ProductDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly release_date: string;
  readonly revision_date: string;
}

export interface ProductsApiResponseDTO {
  readonly data: ProductDTO[];
}

export interface ProductsApiErrorsDTO {
  readonly name: string;
  readonly message: string;
}
