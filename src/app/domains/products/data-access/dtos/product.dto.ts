export interface ProductDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly date_release: string;
  readonly date_revision: string;
}

export interface ProductsApiResponseDTO {
  readonly data: ProductDTO[];
}

export interface ProductsApiErrorsDTO {
  readonly name: string;
  readonly message: string;
}
