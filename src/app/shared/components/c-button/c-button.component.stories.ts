import { Meta, StoryObj } from '@storybook/angular';
import { CButtonComponent } from './c-button.component';

const meta: Meta<CButtonComponent> = {
  title: 'Button UI Component',
  component: CButtonComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
      window,
    },
    template: `<c-button [variant]="variant" [isDisabled]="isDisabled" [isLoading]="isLoading" (onClick)="window.alert('click!')">¡Haz clic aquí!</c-button>`,
  }),
};

export default meta;

type Story = StoryObj<CButtonComponent>;

export const Default: Story = {
  args: {
    variant: 'primary',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    isDisabled: true,
  },
};

export const PrimaryLoading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    isDisabled: true,
  },
};

export const Icon: Story = {
  args: {
    variant: 'icon',
    ariaLabel: 'Favorito',
  },
  render: (args) => ({
    props: {
      ...args,
      window,
    },
    template: `
      <c-button [variant]="variant" [isDisabled]="isDisabled" [isLoading]="isLoading" [aria-label]="ariaLabel" (onClick)="window.alert('click!')">
        <span style="font-size: 1.25rem;">★</span>
      </c-button>
    `,
  }),
};

export const IconDisabled: Story = {
  args: {
    variant: 'icon',
    ariaLabel: 'Favorito',
    isDisabled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      window,
    },
    template: `
      <c-button [variant]="variant" [isDisabled]="isDisabled" [isLoading]="isLoading" [aria-label]="ariaLabel" (onClick)="window.alert('click!')">
        <span style="font-size: 1.25rem;">★</span>
      </c-button>
    `,
  }),
};
