import { TestBed } from '@angular/core/testing';
import { Product } from '@domains/products/business/models/product-model';
import { ProductStore } from './product.store';
import { ProductHttpService } from '@domains/products/data-access/services/product-http.service';
import { Mocked } from 'vitest';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
describe('ProductStore', () => {
  let mockHttpService: Partial<Mocked<ProductHttpService>>;

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
      providers: [ProductStore, { provide: ProductHttpService, useValue: mockHttpService }],
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
      expect(store.error()).toBeNull();

      // Load products
      store.loadProducts();
      expect(store.products()).toEqual([mockProduct]);
    });
    it('should fail loading products', () => {
      const errorResponse = new HttpErrorResponse({
        error: { name: 'InternalError', message: 'Server error' },
        status: 500,
      });
      mockHttpService.getProducts?.mockReturnValue(throwError(() => errorResponse));
      const store = TestBed.inject(ProductStore);
      // Load products
      store.loadProducts();
      expect(store.products()).toEqual([]);
      expect(store.error()).toBe('Server error');
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
});
