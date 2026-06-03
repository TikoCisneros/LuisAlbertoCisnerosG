import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CNotificationComponent } from './notification-toast.component';
import { NotificationService } from '../services/notification.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect } from 'vitest';

describe('CNotificationComponent', () => {
  it('should render the list of active notifications and call onDismiss', async () => {
    const mockNotifications = [
      { id: '1', type: 'success' as const, message: 'Operación exitosa' },
      { id: '2', type: 'error' as const, message: 'Fallo catastrófico' },
    ];
    
    const mockNotificationService = {
      notifications: signal(mockNotifications),
      hideNotification: vi.fn(),
    };

    await render(CNotificationComponent, {
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    // Check both notifications are displayed
    expect(screen.getByText('Operación exitosa')).toBeDefined();
    expect(screen.getByText('Fallo catastrófico')).toBeDefined();

    // Click on the first notification to trigger hideNotification
    const successToast = screen.getByText('Operación exitosa');
    const user = userEvent.setup();
    await user.click(successToast);

    expect(mockNotificationService.hideNotification).toHaveBeenCalledWith('1');
  });

  it('should render nothing or an empty container when there are no active notifications', async () => {
    const mockNotificationService = {
      notifications: signal([]),
      hideNotification: vi.fn(),
    };

    const { container } = await render(CNotificationComponent, {
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });

    // Check that there are no alert elements
    const alerts = container.querySelectorAll('c-alert');
    expect(alerts.length).toBe(0);
  });
});
