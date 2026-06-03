import { InjectionToken } from '@angular/core';
import { environment } from '@env/environment';

export const BASE_URL = new InjectionToken<string>('BASE_URL', {
  providedIn: 'root',
  factory: () => environment.BASE_URL,
});
