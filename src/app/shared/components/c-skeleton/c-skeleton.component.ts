import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'c-skeleton',
  standalone: true,
  templateUrl: './c-skeleton.component.html',
  styleUrl: './c-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CSkeletonComponent {
  width = input<string>('100%');
  height = input<string>('1rem');
}
