import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ProductHttpRepository } from './product-http.repository';
import { BASE_URL } from '@core/services/api-url.token';
import { ProductDTO } from '@domains/products/data-access/dtos/product.dto';
import { Product, ProductErrors } from '@domains/products/domain/models/product-model';

describe('ProductHttpRepository', () => {
  let service: ProductHttpRepository;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost:3002';

  // Datos semilla para las pruebas
  const mockDto: ProductDTO = {
    id: 'PROD-100',
    name: 'Smart Watch v2',
    description: 'Reloj inteligente de última generación.',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    date_release: '2026-01-15',
    date_revision: '2027-05-20',
  };

  const mockProduct: Product = {
    id: 'PROD-100',
    name: 'Smart Watch v2',
    description: 'Reloj inteligente de última generación.',
    logoURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    releaseDate: new Date('2026-01-15T00:00:00.000Z'),
    revisionDate: new Date('2027-05-20T00:00:00.000Z'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: mockBaseUrl },
      ],
    });

    service = TestBed.inject(ProductHttpRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegurar que no queden peticiones HTTP pendientes de resolver
    httpMock.verify();
  });

  it('should be set up correctly', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should send a GET request and map the DTOs to domain objects', () => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(mockProduct.id);
        expect(products[0].releaseDate).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: [mockDto] }); // Mock the enveloped API response
    });

    it('should throw ProductErrors with extracted message on API error response', () => {
      let errorAsserted = false;
      service.getProducts().subscribe({
        next: () => {
          throw new Error('Debería haber fallado');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(ProductErrors);
          expect(error.code).toBe('FETCH_FAILED');
          expect(error.message).toBe('Not product found with that identifier');
          errorAsserted = true;
        },
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      req.flush(
        { name: 'NotFoundError', message: 'Not product found with that identifier' },
        { status: 404, statusText: 'Not Found' },
      );
      expect(errorAsserted).toBe(true);
    });
  });

  describe('createProduct', () => {
    it('should send a POST request with the DTO in the body and return the mapped product', () => {
      service.createProduct(mockProduct).subscribe((responseProduct) => {
        expect(responseProduct.data.id).toBe(mockProduct.id);
        expect(responseProduct.data.name).toBe(mockProduct.name);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      expect(req.request.method).toBe('POST');

      // Valida que los datos enviados al servidor estén en formato DTO (snake_case y formato fecha "2026-01-15")
      expect(req.request.body).toEqual({
        id: 'PROD-100',
        name: 'Smart Watch v2',
        description: 'Reloj inteligente de última generación.',
        logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        date_release: '2026-01-15',
        date_revision: '2027-05-20',
      });

      req.flush({ message: 'Product created successfully', data: mockDto });
    });

    it('should return a 400 Bad Request error when API validation fails', () => {
      const errorResponse = {
        name: 'BadRequestError',
        message: "Invalid body, check 'errors' property for more info.",
      };

      let errorAsserted = false;

      service.createProduct(mockProduct).subscribe({
        next: () => {
          throw new Error('Debería haber fallado con un error 400');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(ProductErrors);
          expect(error.code).toBe('CREATE_FAILED');
          expect(error.message).toBe("Invalid body, check 'errors' property for more info.");
          errorAsserted = true;
        },
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      expect(req.request.method).toBe('POST');
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });

      expect(errorAsserted).toBe(true);
    });
  });

  describe('updateProduct', () => {
    it('should send a PUT request with the DTO in the body and return the modified product', () => {
      service.updateProduct(mockProduct).subscribe((responseProduct) => {
        expect(responseProduct.data.id).toBe(mockProduct.id);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/${mockProduct.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBe(mockProduct.id);

      req.flush({ message: 'Product updated successfully', data: mockDto });
    });
  });

  describe('deleteProduct', () => {
    it('should send a DELETE request to the endpoint with the product ID', () => {
      const targetId = 'PROD-100';

      service.deleteProduct(targetId).subscribe((res) => {
        expect(res).toBe('Product removed successfully');
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/${targetId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Product removed successfully' });
    });

    it('should throw ProductErrors on DELETE request failure', () => {
      let errorAsserted = false;
      const targetId = 'PROD-100';
      service.deleteProduct(targetId).subscribe({
        next: () => {
          throw new Error('Error');
        },
        error: (error) => {
          expect(error).toBeInstanceOf(ProductErrors);
          expect(error.code).toBe('DELETE_FAILED');
          expect(error.message).toContain('Http failure response');
          errorAsserted = true;
        },
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/${targetId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      expect(errorAsserted).toBe(true);
    });
  });

  describe('verifyProductIDExists', () => {
    it('should check whether a product ID already exists by returning a Boolean value', () => {
      const testId = 'PROD-100';

      service.verifyProductIDExists(testId).subscribe((exists) => {
        expect(exists).toBe(true);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/verification/${testId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });
  });
});
