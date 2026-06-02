import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'p-product-operation-page',
  standalone: true,
  imports: [],
  templateUrl: './p-product-operation-page.component.html',
  styleUrl: './p-product-operation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PProductOperationPageComponent {}
