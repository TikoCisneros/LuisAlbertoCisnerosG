import { ProductMapper } from './product.mapper';
import { ProductDTO } from '@domains/products/data-access/dtos/product.dto';
import { Product } from '@domains/products/domain/models/product-model';

describe('ProductMapper', () => {
  it('should correctly map DTO to Domain model', () => {
    const dto: ProductDTO = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logo: 'logo.png',
      date_release: '2026-01-15T00:00:00.000Z',
      date_revision: '2027-01-15T00:00:00.000Z',
    };

    const domain = ProductMapper.dtoToDomain(dto);

    expect(domain.id).toBe('1');
    expect(domain.name).toBe('Test Product');
    expect(domain.description).toBe('Test Description');
    expect(domain.logoURL).toBe('logo.png');
    expect(domain.releaseDate.toISOString()).toContain('2026-01-15');
    expect(domain.revisionDate.toISOString()).toContain('2027-01-15');
  });

  it('should correctly map Domain model to DTO', () => {
    const domain: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      logoURL: 'logo.png',
      releaseDate: new Date('2026-01-15T00:00:00.000Z'),
      revisionDate: new Date('2027-01-15T00:00:00.000Z'),
    };

    const dto = ProductMapper.domainToDto(domain);

    expect(dto.id).toBe('1');
    expect(dto.name).toBe('Test Product');
    expect(dto.description).toBe('Test Description');
    expect(dto.logo).toBe('logo.png');
    expect(dto.date_release).toBe('2026-01-15');
    expect(dto.date_revision).toBe('2027-01-15');
  });
});
