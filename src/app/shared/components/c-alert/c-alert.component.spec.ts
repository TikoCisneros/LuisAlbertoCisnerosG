import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CAlertComponent } from './c-alert.component';

describe('CAlertComponent', () => {
  it('should apply the correct class for info, success, error, warning and render the message correctly', async () => {
    const { fixture } = await render(CAlertComponent, {
      inputs: {
        message: 'This is a test message',
        type: 'info',
      },
    });

    const alert = screen.getByText('This is a test message');
    expect(alert).toBeDefined();
    expect(alert.classList.contains('c-alert--info')).toBeTruthy();

    fixture.componentRef.setInput('type', 'success');
    fixture.detectChanges();
    expect(alert.classList.contains('c-alert--success')).toBeTruthy();

    fixture.componentRef.setInput('type', 'error');
    fixture.detectChanges();
    expect(alert.classList.contains('c-alert--error')).toBeTruthy();

    fixture.componentRef.setInput('type', 'warning');
    fixture.detectChanges();
    expect(alert.classList.contains('c-alert--warning')).toBeTruthy();
  });

  it('should emit dismiss output when clicked', async () => {
    const dismissSpy = vi.fn();

    await render(CAlertComponent, {
      inputs: {
        message: 'Clickable message',
      },
      on: {
        onDismiss: dismissSpy,
      },
    });

    const alert = screen.getByText('Clickable message');
    const user = userEvent.setup();
    await user.click(alert);

    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should apply the floating class when isFloating is set to true', async () => {
    const { fixture } = await render(CAlertComponent, {
      inputs: {
        message: 'Floating alert',
        isFloating: true,
      },
    });

    const alert = screen.getByText('Floating alert');
    expect(alert.classList.contains('c-alert--floating')).toBeTruthy();
  });
});
