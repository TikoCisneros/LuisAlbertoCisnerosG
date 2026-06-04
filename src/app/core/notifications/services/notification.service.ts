import { computed, Injectable, signal } from '@angular/core';
import { NotificationType, Notification } from '../models/notification.model';
import { generateUUID } from '@shared/utils/uuid.utils';

const NOTIFICATION_SHOW_TIME = 4000 as const;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = computed(() => this._notifications());

  hideNotification(id: string) {
    this._notifications.update((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }

  notify(type: NotificationType, message: string) {
    const notification = {
      id: generateUUID(),
      type,
      message,
    };

    this._notifications.update((current) => [...current, notification]);

    setTimeout(() => this.hideNotification(notification.id), NOTIFICATION_SHOW_TIME);
  }
}
