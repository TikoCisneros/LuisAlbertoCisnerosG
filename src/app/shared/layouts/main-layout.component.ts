import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { CHeaderComponent } from '../components/c-header/c-header.component';

@Component({
  selector: 'l-main-layout',
  standalone: true,
  imports: [RouterOutlet, CHeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /**
   * Se compara la URL para saber si es una subruta de productos y volver al inicio
   */
  readonly backUrl = computed<string | null>(() => {
    return this.currentUrl().includes('/products/') ? '/products' : null;
  });
}
