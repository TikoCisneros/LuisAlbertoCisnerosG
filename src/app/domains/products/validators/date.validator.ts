import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isTodayOrFuture } from '@shared/utils/date.utils';

/**
 * An Angular validation rule that ensures the selected date is today or later.
 */
export function futureOrTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || typeof value !== 'string') {
      return null;
    }

    const isValid = isTodayOrFuture(value);

    return isValid ? null : { invalidDate: true };
  };
}
