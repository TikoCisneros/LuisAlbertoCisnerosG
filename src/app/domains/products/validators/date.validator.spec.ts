import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { futureOrTodayValidator } from './date.validator';
import { toInputDateFormat } from '@shared/utils/date.utils';

describe('futureOrTodayValidator', () => {
  const validator = futureOrTodayValidator();

  it('should return null when the control has no value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return null when the date is today', () => {
    const todayStr = toInputDateFormat(new Date());
    const control = new FormControl(todayStr);
    expect(validator(control)).toBeNull();
  });

  it('should return null when the date is in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureStr = toInputDateFormat(futureDate);
    const control = new FormControl(futureStr);
    
    expect(validator(control)).toBeNull();
  });

  it('should return invalidDate error object when date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);
    const pastStr = toInputDateFormat(pastDate);
    const control = new FormControl(pastStr);

    expect(validator(control)).toEqual({ invalidDate: true });
  });

  it('should return null if the value is not a string', () => {
    const control = new FormControl(12345);
    expect(validator(control)).toBeNull();
  });
});
