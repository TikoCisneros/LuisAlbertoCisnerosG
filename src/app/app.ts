import { Component, inject } from '@angular/core';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';
import { NotificationOverlayService } from '@core/notifications/services/notification-overlay.service';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.html',
})
export class App {
  // Al inyectar el servicio aquí en el constructor del componente raíz,
  // Angular lo instancia inmediatamente en el arranque de la app,
  // activando el efecto reactivo que vigila el estado de las notificaciones.
  private readonly notificationOverlay = inject(NotificationOverlayService);
}
