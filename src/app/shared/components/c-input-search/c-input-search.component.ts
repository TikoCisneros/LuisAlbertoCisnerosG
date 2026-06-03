import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'c-input-search',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ matClose })],
  templateUrl: './c-input-search.component.html',
  styleUrl: './c-input-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CInputSearchComponent {
  placeholder = input<string>('');
  value = input<string>('');

  onValueChange = output<string>();

  onInputHandler(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.onValueChange.emit(inputElement.value);
  }

  clear(): void {
    this.onValueChange.emit('');
  }
}
