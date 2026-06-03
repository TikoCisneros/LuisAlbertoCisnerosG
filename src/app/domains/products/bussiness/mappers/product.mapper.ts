import { Product } from './../models/product-model';
import { ProductDTO } from '../../data-access/dtos/product.dto';
import { parseDate, formatDate } from '../../../../shared/utils/date.utils';

export class ProductMapper {
  static dtoToDomain({
    id,
    logo,
    description,
    name,
    release_date,
    revision_date,
  }: ProductDTO): Product {
    return {
      id,
      name,
      description,
      logoURL: logo,
      releaseDate: parseDate(release_date),
      revisionDate: parseDate(revision_date),
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
      release_date: formatDate(releaseDate),
      revision_date: formatDate(revisionDate),
    };
  }

  static dtosToDomainList(dtos: ProductDTO[]): Product[] {
    return dtos.map((dto) => this.dtoToDomain(dto));
  }
}
