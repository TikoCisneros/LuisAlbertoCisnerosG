import { Product } from '@domains/products/business/models/product-model';
import { ProductDTO } from '@domains/products/data-access/dtos/product.dto';
import { parseDate, formatDate } from '@shared/utils/date.utils';

export class ProductMapper {
  static dtoToDomain({
    id,
    logo,
    description,
    name,
    date_release,
    date_revision,
  }: ProductDTO): Product {
    return {
      id,
      name,
      description,
      logoURL: logo,
      releaseDate: parseDate(date_release),
      revisionDate: parseDate(date_revision),
    };
  }

  static domainToDto({
    id,
    logoURL,
    description,
    name,
    releaseDate,
    revisionDate,
  }: Product): ProductDTO {
    return {
      id,
      name,
      description,
      logo: logoURL,
      date_release: formatDate(releaseDate),
      date_revision: formatDate(revisionDate),
    };
  }

  static dtosToDomainList(dtos: ProductDTO[]): Product[] {
    return dtos.map((dto) => this.dtoToDomain(dto));
  }
}
