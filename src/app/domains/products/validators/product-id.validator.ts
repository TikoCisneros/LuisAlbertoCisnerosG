import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ProductRepository } from '@domains/products/domain/repositories/product.repository';

/**
 * Asynchronous validator with debounce to check if a product ID already exists.
 */
export function uniqueProductIdValidator(productService: ProductRepository): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // Actúa como debounce de 500ms
    return timer(500).pipe(
      switchMap(() => productService.verifyProductIDExists(control.value)),
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null)),
    );
  };
}
