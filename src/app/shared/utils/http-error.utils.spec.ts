import { describe, it, expect } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { httpErrorMessageParser } from './http-error.utils';

describe('httpErrorMessageParser', () => {
  it('should format validation errors with bullet points and newlines', () => {
    const mockErrorBody = {
      name: 'BadRequestError',
      message: 'Invalid body',
      errors: [
        {
          property: 'name',
          constraints: {
            minLength: 'name must be longer than 5 chars',
          },
        },
        {
          property: 'logoURL',
          constraints: {
            isNotEmpty: 'logoURL should not be empty',
          },
        },
      ],
    };

    const httpError = new HttpErrorResponse({
      error: mockErrorBody,
      status: 400,
      statusText: 'Bad Request',
    });

    const parsed = httpErrorMessageParser(httpError);
    expect(parsed).toBe('• name must be longer than 5 chars\n• logoURL should not be empty');
  });

  it('should return error body message if it has no validation errors list', () => {
    const mockErrorBody = {
      name: 'NotFoundError',
      message: 'Product not found',
    };

    const httpError = new HttpErrorResponse({
      error: mockErrorBody,
      status: 404,
      statusText: 'Not Found',
    });

    const parsed = httpErrorMessageParser(httpError);
    expect(parsed).toBe('Product not found');
  });

  it('should fallback to statusText message if body is empty', () => {
    const httpError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    const parsed = httpErrorMessageParser(httpError);
    expect(parsed).toContain('Http failure response');
  });
});
