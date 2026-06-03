import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { CAlertComponent } from '@shared/components/c-alert/c-alert.component';

@Component({
  selector: 'notification-toast',
  standalone: true,
  imports: [CAlertComponent],
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CNotificationComponent {
  readonly notificationService = inject(NotificationService);
  readonly notifications = this.notificationService.notifications;

  onDismiss(id: string): void {
    this.notificationService.hideNotification(id);
  }
}
