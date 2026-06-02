import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-products-list-page',
  standalone: true,
  imports: [],
  templateUrl: './p-products-list-page.component.html',
  styleUrl: './p-products-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductsListPageComponent {}
