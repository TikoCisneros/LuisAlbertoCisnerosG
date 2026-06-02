import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'c-logo',
  standalone: true,
  imports: [],
  templateUrl: './c-logo.component.html',
  styleUrl: './c-logo.component.scss',
})
export class CLogoComponent {
  src = input<string | null | undefined>(null);
  fallbackName = input<string>('');

  imageError = signal<boolean>(false);

  // creacion de fallback
  initials = computed(() => {
    const name = this.fallbackName();
    if (name && typeof name === 'string') {
      return name.slice(0, 2).toUpperCase();
    }
    return 'NA';
  });

  onImgError(): void {
    this.imageError.set(true);
  }
}
