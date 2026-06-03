import { Meta, StoryObj } from '@storybook/angular';
import { CModalComponent } from './c-modal.component';

const meta: Meta<CModalComponent> = {
  title: 'Modal UI Component',
  component: CModalComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 50px; background-color: var(--bg-surface-gray, #f8fafc); min-height: 250px; border-radius: 8px;">
        <c-modal
          [isOpen]="isOpen"
          [bodyText]="bodyText"
          [confirmText]="confirmText"
          [cancelText]="cancelText"
          [isLoading]="isLoading"
          (onConfirm)="onConfirm()"
          (onCancel)="onCancel()"
        ></c-modal>
      </div>
    `,
  }),
  argTypes: {
    onConfirm: { action: 'onConfirm' },
    onCancel: { action: 'onCancel' },
  },
};

export default meta;

type Story = StoryObj<CModalComponent>;

export const DefaultOpen: Story = {
  args: {
    isOpen: true,
    bodyText: '¿Estás seguro de que deseas eliminar este producto permanentemente de la base de datos? Esta acción no se puede deshacer.',
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
    isLoading: false,
  },
};

export const LoadingState: Story = {
  args: {
    isOpen: true,
    bodyText: 'Procesando la transacción, por favor espera un momento...',
    confirmText: 'Procesando...',
    cancelText: 'Cancelar',
    isLoading: true,
  },
};

export const InteractiveDemo: Story = {
  args: {
    isOpen: false,
    bodyText: '¡Hola! Este es un modal interactivo muy amigable. ¿Quieres confirmar la operación?',
    confirmText: 'Confirmar',
    cancelText: 'Volver',
    isLoading: false,
  },
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 50px; text-align: center;">
        <button 
          style="padding: 10px 20px; font-weight: 600; background-color: #f3125a; color: #white; border: none; border-radius: 6px; cursor: pointer; color: white;"
          (click)="isOpen = true"
        >
          Abrir Modal de Prueba
        </button>
 
        <c-modal
          [isOpen]="isOpen"
          [bodyText]="bodyText"
          [confirmText]="confirmText"
          [cancelText]="cancelText"
          [isLoading]="isLoading"
          (onConfirm)="isOpen = false; onConfirm()"
          (onCancel)="isOpen = false; onCancel()"
        ></c-modal>
      </div>
    `,
  }),
};
