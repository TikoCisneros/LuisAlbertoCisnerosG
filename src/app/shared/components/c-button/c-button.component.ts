import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'icon';

@Component({
  selector: 'c-button',
  standalone: true,
  host: {
    '[class.c-button-host--full-width]': 'isFullWidth()',
  },
  templateUrl: './c-button.component.html',
  styleUrl: './c-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CButtonComponent {
  variant = input<ButtonVariant>('primary');
  isDisabled = input<boolean>(false);
  isLoading = input<boolean>(false);
  isFullWidth = input<boolean>(false);
  ariaLabel = input<string | null>(null, { alias: 'aria-label' });
  onClick = output<MouseEvent>();

  clickHandler(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isLoading()) {
      event.preventDefault();
      return;
    }
    this.onClick.emit(event);
  }
}
