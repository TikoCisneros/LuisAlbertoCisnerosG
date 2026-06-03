import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'c-alert',
  standalone: true,
  templateUrl: './c-alert.component.html',
  styleUrl: './c-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CAlertComponent {
  message = input.required<string>();
  type = input<'info' | 'success' | 'error' | 'warning'>('info');
  isFloating = input<boolean>(false);
  onDismiss = output<void>();

  onDismissHandler(): void {
    this.onDismiss.emit();
  }
}
