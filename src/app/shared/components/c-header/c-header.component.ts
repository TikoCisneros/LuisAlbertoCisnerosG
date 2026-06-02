import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matPayments, matArrowBack } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'c-header',
  standalone: true,
  templateUrl: './c-header.component.html',
  styleUrl: './c-header.component.scss',
  imports: [NgIcon, RouterLink],
  viewProviders: [provideIcons({ matPayments, matArrowBack })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CHeaderComponent {
  backUrl = input<string | null>(null);
}
