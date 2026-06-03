import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ProductHttpService } from './product-http.service';
import { BASE_URL } from '@core/services/api-url.token';
import { ProductDTO } from '../dtos/product.dto';
import { Product } from '@domains/products/bussiness/models/product-model';

describe('Pruebas de ProductHttpService', () => {
  let service: ProductHttpService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost:3002';

  // Datos semilla para las pruebas
  const mockDto: ProductDTO = {
    id: 'PROD-100',
    name: 'Smart Watch v2',
    description: 'Reloj inteligente de última generación.',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    release_date: '2026-01-15',
    revision_date: '2027-05-20',
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
        ProductHttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: BASE_URL, useValue: mockBaseUrl },
      ],
    });

    service = TestBed.inject(ProductHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegurar que no queden peticiones HTTP pendientes de resolver
    httpMock.verify();
  });

  it('debería crearse correctamente el servicio', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('debería enviar una petición GET y mapear los DTOs a productos de dominio', (done) => {
      service.getProducts().subscribe((products) => {
        expect(products.length).toBe(1);
        expect(products[0].id).toBe(mockProduct.id);
        expect(products[0].releaseDate).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: [mockDto] }); // Mock the enveloped API response
    });
  });

  describe('createProduct', () => {
    it('debería enviar una petición POST con el DTO en el cuerpo y retornar el producto mapeado', () => {
      service.createProduct(mockProduct).subscribe((responseProduct) => {
        expect(responseProduct.id).toBe(mockProduct.id);
        expect(responseProduct.name).toBe(mockProduct.name);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products`);
      expect(req.request.method).toBe('POST');

      // Valida que los datos enviados al servidor estén en formato DTO (snake_case y formato fecha "2026-01-15")
      expect(req.request.body).toEqual({
        id: 'PROD-100',
        name: 'Smart Watch v2',
        description: 'Reloj inteligente de última generación.',
        logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        release_date: '2026-01-15',
        revision_date: '2027-05-20',
      });

      req.flush(mockDto);
    });

    it('debería propagar un error BadRequest 400 cuando la validación de la API falla', () => {
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
          expect(error.status).toBe(400);
          expect(error.error).toEqual(errorResponse);
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
    it('debería enviar una petición PUT con el DTO en el cuerpo y retornar el producto modificado', () => {
      service.updateProduct(mockProduct).subscribe((responseProduct) => {
        expect(responseProduct.id).toBe(mockProduct.id);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/${mockProduct.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.id).toBe(mockProduct.id);

      req.flush(mockDto);
    });
  });

  describe('deleteProduct', () => {
    it('debería enviar una petición DELETE al endpoint con el ID del producto', () => {
      const targetId = 'PROD-100';

      service.deleteProduct(targetId).subscribe((res) => {
        expect(res).toBe('true');
      });

      const req = httpMock.expectOne(`${mockBaseUrl}/products/${targetId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('true');
    });
  });

  describe('verifyProductIDExists', () => {
    it('debería verificar si un ID de producto ya existe retornando un valor booleano', () => {
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
