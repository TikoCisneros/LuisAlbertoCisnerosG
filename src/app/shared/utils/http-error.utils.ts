import { HttpErrorResponse } from '@angular/common/http';
import { ProductsApiErrorsDTO } from '@domains/products/data-access/dtos/product.dto'; // O un tipo genérico de error de API

/**
 * Extract and format error messages from the API's HTTP responses, including support for multi-line validation errors.
 */
export function httpErrorMessageParser(err: HttpErrorResponse): string {
  const errorBody = err.error as ProductsApiErrorsDTO;

  // Si contiene el array de errores de validación estructurados del backend
  if (errorBody && errorBody.errors && errorBody.errors.length > 0) {
    return errorBody.errors
      .map((errorDetail) => {
        const fieldConstraints = Object.values(errorDetail.constraints);
        return fieldConstraints.map((constraint) => `• ${constraint}`).join('\n');
      })
      .join('\n');
  }

  // Fallback por defecto si no es un error de validación
  return errorBody?.message || err.message || 'Error desconocido';
}
