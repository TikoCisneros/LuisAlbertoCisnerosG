import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CButtonComponent } from '@shared/components/c-button/c-button.component';

@Component({
  selector: 'c-modal',
  standalone: true,
  imports: [CButtonComponent],
  templateUrl: './c-modal.component.html',
  styleUrl: './c-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CModalComponent {
  isOpen = input.required<boolean>();
  bodyText = input<string>('');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  isLoading = input<boolean>(false);

  onConfirm = output<void>();
  onCancel = output<void>();

  onConfirmHandler(): void {
    if (!this.isLoading()) {
      this.onConfirm.emit();
    }
  }

  onCancelHandler(): void {
    this.onCancel.emit();
  }
}
