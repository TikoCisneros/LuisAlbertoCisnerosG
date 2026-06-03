import { Meta, StoryObj } from '@storybook/angular';
import { CAlertComponent } from './c-alert.component';

const meta: Meta<CAlertComponent> = {
  title: 'Alert UI Component',
  component: CAlertComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'error', 'warning'],
    },
    onDismiss: { action: 'dismiss' },
  },
};

export default meta;
type Story = StoryObj<CAlertComponent>;

export const Info: Story = {
  args: {
    message: 'Esta es una alerta informativa importante.',
    type: 'info',
  },
};

export const Success: Story = {
  args: {
    message: '¡Operación realizada con éxito!',
    type: 'success',
  },
};

export const Warning: Story = {
  args: {
    message: 'Atención: Estás por superar el límite de productos.',
    type: 'warning',
  },
};

export const ErrorVariant: Story = {
  args: {
    message: 'Ha ocurrido un error al intentar eliminar el registro.',
    type: 'error',
  },
};

export const InteractiveDemo: Story = {
  render: (args) => ({
    props: {
      ...args,
      showAlert: false,
    },
    template: `
      <div style="padding: 40px; text-align: center;">
        <p style="margin-bottom: 20px; color: var(--text-main, #0f172a);">
          Haz clic en el botón para simular el disparo y la visualización de la alerta.
        </p>
        <button
          style="padding: 10px 20px; font-weight: 600; background-color: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
          (click)="showAlert = true"
        >
          Mostrar Alerta
        </button>

        @if (showAlert) {
          <c-alert
            [isFloating]="'true'"
            [message]="message"
            [type]="type"
            (onDismiss)="showAlert = false; dismiss()"
          ></c-alert>
        }
      </div>
    `,
  }),
  args: {
    message: '¡Esta es una alerta disparada dinámicamente! Haz clic sobre ella para cerrarla.',
    type: 'success',
  },
};
