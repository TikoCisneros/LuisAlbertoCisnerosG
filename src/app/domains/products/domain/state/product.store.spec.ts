import { TestBed } from '@angular/core/testing';
import { Product, ProductErrors } from '@domains/products/domain/models/product-model';
import { ProductStore } from './product.store';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { Mocked } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';

describe('ProductStore', () => {
  let mockHttpService: Partial<Mocked<ProductRepository>>;

  const mockProduct: Product = {
    id: 'PROD-100',
    name: 'Smart TV v2',
    description: 'LG Smart TV',
    logoURL: 'logo.png',
    releaseDate: new Date('2026-01-15T00:00:00.000Z'),
    revisionDate: new Date('2027-05-20T00:00:00.000Z'),
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Alpha Device',
      description: 'Premium Watch',
      logoURL: 'a.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
    {
      id: '2',
      name: 'Beta Watch',
      description: 'Budget Tracker',
      logoURL: 'b.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
    {
      id: '3',
      name: 'Gamma Band',
      description: 'Budget Bracelet',
      logoURL: 'c.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
    {
      id: '4',
      name: 'Delta Smartwatch',
      description: 'Smart device',
      logoURL: 'd.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
    {
      id: '5',
      name: 'Epsilon Tracker',
      description: 'Fitness tracker',
      logoURL: 'e.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
    {
      id: '6',
      name: 'Zeta Clock',
      description: 'Office clock',
      logoURL: 'f.png',
      releaseDate: new Date(),
      revisionDate: new Date(),
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-31T12:00:00Z'));

    mockHttpService = {
      getProducts: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      verifyProductIDExists: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductStore,
        { provide: ProductRepository, useValue: mockHttpService },
        GetProductsUseCase,
        CreateProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('loadProducts', () => {
    it('should load products successfully', () => {
      mockHttpService.getProducts?.mockReturnValue(of([mockProduct]));
      const store = TestBed.inject(ProductStore);
      // Initial State
      expect(store.products()).toEqual([]);
      expect(store.isLoading()).toBeFalsy();

      // Load products
      store.loadProducts();
      expect(store.products()).toEqual([mockProduct]);
    });
    it('should fail loading products', () => {
      mockHttpService.getProducts?.mockReturnValue(
        throwError(() => new ProductErrors('FETCH_FAILED', 'Server error')),
      );
      const store = TestBed.inject(ProductStore);
      // Load products
      store.loadProducts();
      expect(store.products()).toEqual([]);
    });
  });

  describe('Filter functionality', () => {
    beforeEach(() => {
      mockHttpService.getProducts?.mockReturnValue(of(mockProducts));
    });

    it('should initialize with empty searchTerm', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      expect(store.searchTerm()).toBe('');
    });

    it('should filter products by name or description', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      // Search matches 'Budget' in description of Beta Watch and Gamma Band
      store.setSearchTerm('Budget');
      expect(store.filteredProducts()).toHaveLength(2);
      expect(store.filteredProducts().map((p: any) => p.name)).toEqual([
        'Beta Watch',
        'Gamma Band',
      ]);

      // Search matches nothing
      store.setSearchTerm('xyz');
      expect(store.filteredProducts()).toEqual([]);
    });
  });

  describe('Pagination functionality', () => {
    beforeEach(() => {
      mockHttpService.getProducts?.mockReturnValue(of(mockProducts));
    });

    it('should initialize with default pagination state', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      expect(store.currentPage()).toBe(1);
      expect(store.pageSize()).toBe(5);
      expect(store.totalResults()).toBe(6);
      expect(store.totalPages()).toBe(2);
    });

    it('should paginate results according to currentPage and pageSize', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      // Page 1 with pageSize 5: should return first 5 products
      expect(store.paginatedProducts()).toHaveLength(5);
      expect(store.paginatedProducts()[0].id).toBe('1');
      expect(store.paginatedProducts()[4].id).toBe('5');

      // Page 2: should return the remaining 1 product
      store.setCurrentPage(2);
      expect(store.paginatedProducts()).toHaveLength(1);
      expect(store.paginatedProducts()[0].id).toBe('6');
    });

    it('should reset currentPage to 1 when changing pageSize', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      store.setCurrentPage(2);
      expect(store.currentPage()).toBe(2);

      store.setPageSize(2);
      expect(store.pageSize()).toBe(2);
      expect(store.currentPage()).toBe(1);
      expect(store.totalPages()).toBe(3); // 6 products / 2 size = 3 pages
    });

    it('should allow changing page only within valid boundaries', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      // Total pages is 2. Setting page to 2 should succeed.
      store.setCurrentPage(2);
      expect(store.currentPage()).toBe(2);

      // Setting page to 3 (out of bounds) should be ignored.
      store.setCurrentPage(3);
      expect(store.currentPage()).toBe(2);

      // Setting page to 0 (out of bounds) should be ignored.
      store.setCurrentPage(0);
      expect(store.currentPage()).toBe(2);
    });
  });
});
