import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with an empty array of notifications', () => {
    expect(service.notifications()).toEqual([]);
  });

  it('should add a notification when notify is called and generate a unique ID', () => {
    service.notify('success', 'Guardado con éxito');

    const activeList = service.notifications();
    expect(activeList.length).toBe(1);
    expect(activeList[0].message).toBe('Guardado con éxito');
    expect(activeList[0].type).toBe('success');
    expect(activeList[0].id).toBeDefined();
  });

  it('should remove the notification manually when hideNotification is called', () => {
    service.notify('error', 'Petición demorada');
    const firstNotificationId = service.notifications()[0].id;

    // Se descarta manualmente
    service.hideNotification(firstNotificationId);

    expect(service.notifications()).toEqual([]);
  });

  it('should auto-dismiss the notification after the 4000ms timeout has passed', () => {
    service.notify('error', 'Error del servidor');
    expect(service.notifications().length).toBe(1);

    // Avanza el tiempo simulado en 4 segundos
    vi.advanceTimersByTime(4000);

    expect(service.notifications()).toEqual([]);
  });

  it('should support multiple active notifications concurrently', () => {
    service.notify('success', 'Éxito 1');
    service.notify('error', 'Error 2');

    const activeList = service.notifications();
    expect(activeList.length).toBe(2);
    expect(activeList[0].message).toBe('Éxito 1');
    expect(activeList[1].message).toBe('Error 2');
  });

  it('should do nothing when trying to hide a non-existent notification ID', () => {
    service.notify('success', 'Éxito 1');
    expect(service.notifications().length).toBe(1);

    service.hideNotification('non-existent-id');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].message).toBe('Éxito 1');
  });
});
