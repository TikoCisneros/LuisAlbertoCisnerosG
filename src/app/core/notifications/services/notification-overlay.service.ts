import { inject, Injectable, effect, computed } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { NotificationService } from './notification.service';
import { CNotificationComponent } from '../components/notification-toast.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly notificationService = inject(NotificationService);
  private overlayRef: OverlayRef | null = null;

  // Signal computada: evalúa si hay al menos una notificación activa
  private readonly hasNotifications = computed(
    () => this.notificationService.notifications().length > 0,
  );

  constructor() {
    // Reacciona abriendo o cerrando el contenedor de CDK Overlay
    effect(() => {
      if (this.hasNotifications()) {
        this.openOverlay();
      } else {
        this.closeOverlay();
      }
    });
  }

  private openOverlay(): void {
    if (this.overlayRef) return; // Evita duplicar el contenedor overlay

    // Ubica el contenedor general arriba a la derecha de la ventana
    const positionStrategy = this.overlay.position().global().top('24px').right('24px');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false, // Permite al usuario seguir interactuando con la aplicación
    });

    // Inyecta el componente Smart como portal dentro del overlay de CDK
    const notificationPortal = new ComponentPortal(CNotificationComponent);
    this.overlayRef.attach(notificationPortal);
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      // Destruye el portal y limpia el DOM cuando no hay alertas
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
