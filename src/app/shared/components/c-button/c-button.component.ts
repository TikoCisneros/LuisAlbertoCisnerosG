import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'c-button',
  standalone: true,
  templateUrl: './c-button.component.html',
  styleUrl: './c-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CButtonComponent {
  variant = input<ButtonVariant>('primary');
  isDisabled = input<boolean>(false);
  isLoading = input<boolean>(false);
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
