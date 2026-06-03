import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export const BASE_URL = new InjectionToken<string>('BASE_URL', {
  providedIn: 'root',
  factory: () => environment.BASE_URL,
});
