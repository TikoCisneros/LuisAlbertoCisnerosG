import { TestBed } from '@angular/core/testing';
import { NotificationOverlayService } from './notification-overlay.service';
import { NotificationService } from './notification.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('NotificationOverlayService', () => {
  let service: NotificationOverlayService;
  let mockOverlay: any;
  let mockOverlayRef: any;
  let mockNotificationsSignal: any;

  beforeEach(() => {
    // Definimos los mocks para el Overlay de Angular CDK
    mockOverlayRef = {
      attach: vi.fn(),
      dispose: vi.fn(),
    };

    mockOverlay = {
      position: vi.fn().mockReturnValue({
        global: vi.fn().mockReturnValue({
          top: vi.fn().mockReturnValue({
            right: vi.fn().mockReturnThis(),
          }),
        }),
      }),
      create: vi.fn().mockReturnValue(mockOverlayRef),
    };

    // Mock del servicio de notificaciones con señal reactiva controlable
    mockNotificationsSignal = signal<any[]>([]);
    const mockNotificationService = {
      notifications: mockNotificationsSignal,
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationOverlayService,
        { provide: Overlay, useValue: mockOverlay },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    service = TestBed.inject(NotificationOverlayService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should reactively open the overlay when notifications become active', () => {
    // Simula la llegada de una notificación reactiva
    mockNotificationsSignal.set([
      { id: '1', type: 'success', message: '¡Éxito!' },
    ]);

    // Forzamos la ejecución de los efectos en el ciclo de pruebas
    TestBed.flushEffects();

    // Verificamos que se cree y adjunte el overlay
    expect(mockOverlay.create).toHaveBeenCalled();
    expect(mockOverlayRef.attach).toHaveBeenCalled();
  });

  it('should reactively dispose of the overlay when the active notification list becomes empty', () => {
    // 1. Abre el overlay
    mockNotificationsSignal.set([
      { id: '1', type: 'success', message: '¡Éxito!' },
    ]);
    TestBed.flushEffects();
    expect(mockOverlay.create).toHaveBeenCalled();

    // 2. Limpia el listado de alertas
    mockNotificationsSignal.set([]);
    TestBed.flushEffects();

    // Verificamos que se destruya el contenedor para limpiar el DOM
    expect(mockOverlayRef.dispose).toHaveBeenCalled();
  });

  it('should not recreate the overlay if one is already open when notifications list changes', () => {
    // 1. Abre el overlay con una primera notificación
    mockNotificationsSignal.set([
      { id: '1', type: 'success', message: 'Primera notificación' },
    ]);
    TestBed.flushEffects();
    expect(mockOverlay.create).toHaveBeenCalledTimes(1);

    // 2. Agrega una segunda notificación (hasNotifications sigue siendo true)
    mockNotificationsSignal.set([
      { id: '1', type: 'success', message: 'Primera notificación' },
      { id: '2', type: 'error', message: 'Segunda notificación' },
    ]);
    TestBed.flushEffects();

    // Verificamos que no se volvió a llamar a create
    expect(mockOverlay.create).toHaveBeenCalledTimes(1);
  });
});
