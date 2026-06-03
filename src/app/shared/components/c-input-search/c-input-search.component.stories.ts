import { Meta, StoryObj } from '@storybook/angular';
import { CInputSearchComponent } from './c-input-search.component';

const meta: Meta<CInputSearchComponent> = {
  title: 'Input Search UI Component',
  component: CInputSearchComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="max-width: 400px; padding: 20px;">
        <c-input-search 
          [placeholder]="placeholder" 
          [value]="value"
          (onValueChange)="onValueChange($event)"
        ></c-input-search>
      </div>
    `,
  }),
  argTypes: {
    onValueChange: { action: 'onValueChange' },
  },
};

export default meta;

type Story = StoryObj<CInputSearchComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Buscar productos...',
    value: '',
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Buscar productos...',
    value: 'Teléfono',
  },
};
