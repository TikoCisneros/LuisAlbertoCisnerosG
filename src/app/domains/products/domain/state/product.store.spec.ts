import { TestBed } from '@angular/core/testing';
import { Product, ProductErrors } from '@domains/products/domain/models/product-model';
import { ProductStore } from './product.store';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';
import { Mocked } from 'vitest';
import { of, throwError } from 'rxjs';
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

  describe('When loading products', () => {
    it('should successfully fetch the list and update the store products', () => {
      mockHttpService.getProducts?.mockReturnValue(of([mockProduct]));
      const store = TestBed.inject(ProductStore);

      expect(store.products()).toEqual([]);
      expect(store.isLoading()).toBeFalsy();

      store.loadProducts();
      expect(store.products()).toEqual([mockProduct]);
    });

    it('should keep the list empty and transition out of loading when the fetch fails', () => {
      mockHttpService.getProducts?.mockReturnValue(
        throwError(() => new ProductErrors('FETCH_FAILED', 'Server error')),
      );
      const store = TestBed.inject(ProductStore);

      store.loadProducts();
      expect(store.products()).toEqual([]);
    });
  });

  describe('When searching products', () => {
    beforeEach(() => {
      mockHttpService.getProducts?.mockReturnValue(of(mockProducts));
    });

    it('should start with an empty search term by default', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      expect(store.searchTerm()).toBe('');
    });

    it('should correctly filter the list based on match in product name or description', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      store.setSearchTerm('Budget');
      expect(store.filteredProducts()).toHaveLength(2);
      expect(store.filteredProducts().map((p: any) => p.name)).toEqual([
        'Beta Watch',
        'Gamma Band',
      ]);

      store.setSearchTerm('xyz');
      expect(store.filteredProducts()).toEqual([]);
    });
  });

  describe('When using pagination', () => {
    beforeEach(() => {
      mockHttpService.getProducts?.mockReturnValue(of(mockProducts));
    });

    it('should initialize with standard default values for pagination state', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();
      expect(store.currentPage()).toBe(1);
      expect(store.pageSize()).toBe(5);
      expect(store.totalResults()).toBe(6);
      expect(store.totalPages()).toBe(2);
    });

    it('should slice the products list to show only the active page items', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      expect(store.paginatedProducts()).toHaveLength(5);
      expect(store.paginatedProducts()[0].id).toBe('1');
      expect(store.paginatedProducts()[4].id).toBe('5');

      store.setCurrentPage(2);
      expect(store.paginatedProducts()).toHaveLength(1);
      expect(store.paginatedProducts()[0].id).toBe('6');
    });

    it('should automatically reset the current page back to 1 if page size changes', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      store.setCurrentPage(2);
      expect(store.currentPage()).toBe(2);

      store.setPageSize(2);
      expect(store.pageSize()).toBe(2);
      expect(store.currentPage()).toBe(1);
      expect(store.totalPages()).toBe(3);
    });

    it('should ignore page changes that go out of valid bounds', () => {
      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      store.setCurrentPage(2);
      expect(store.currentPage()).toBe(2);

      store.setCurrentPage(3);
      expect(store.currentPage()).toBe(2);

      store.setCurrentPage(0);
      expect(store.currentPage()).toBe(2);
    });
  });

  describe('When modifying products', () => {
    it('should add the new product to the list on a successful API creation call', () => {
      const newProduct: Product = { ...mockProduct, id: 'PROD-200', name: 'New Product' };
      mockHttpService.createProduct?.mockReturnValue(
        of({ message: 'Product created successfully', data: newProduct }),
      );

      const store = TestBed.inject(ProductStore);
      
      expect(store.products()).toEqual([]);

      store.addProduct(newProduct);

      expect(store.products()).toContainEqual(newProduct);
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
    });

    it('should transition into error state if the creation API fails', () => {
      mockHttpService.createProduct?.mockReturnValue(
        throwError(() => new ProductErrors('CREATE_FAILED', 'Server error')),
      );

      const store = TestBed.inject(ProductStore);
      store.addProduct(mockProduct);

      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(true);
    });

    it('should update the properties of the modified product in the local list', () => {
      const modifiedProduct: Product = { ...mockProduct, name: 'Modified Name' };
      mockHttpService.getProducts?.mockReturnValue(of([mockProduct]));
      mockHttpService.updateProduct?.mockReturnValue(
        of({ message: 'Updated successfully', data: modifiedProduct }),
      );

      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      expect(store.products()[0].name).toBe('Smart TV v2');

      store.updateProduct(modifiedProduct);

      expect(store.products()[0].name).toBe('Modified Name');
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
    });

    it('should set error state if the update API fails', () => {
      mockHttpService.updateProduct?.mockReturnValue(
        throwError(() => new ProductErrors('UPDATE_FAILED', 'Error updating product')),
      );

      const store = TestBed.inject(ProductStore);
      store.updateProduct(mockProduct);

      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(true);
    });

    it('should successfully remove a product from the list upon a successful deletion API call', () => {
      mockHttpService.getProducts?.mockReturnValue(of([mockProduct]));
      mockHttpService.deleteProduct?.mockReturnValue(of('Product deleted successfully'));

      const store = TestBed.inject(ProductStore);
      store.loadProducts();

      expect(store.products()).toHaveLength(1);

      store.deleteProduct(mockProduct.id);

      expect(store.products()).toHaveLength(0);
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
    });

    it('should report an error state when the deletion API fails', () => {
      mockHttpService.deleteProduct?.mockReturnValue(
        throwError(() => new ProductErrors('DELETE_FAILED', 'Error deleting product')),
      );

      const store = TestBed.inject(ProductStore);
      store.deleteProduct(mockProduct.id);

      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(true);
    });
  });
});

