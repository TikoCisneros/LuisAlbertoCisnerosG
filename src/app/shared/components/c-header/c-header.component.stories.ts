import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { matPayments, matArrowBack } from '@ng-icons/material-icons/baseline';
import { CHeaderComponent } from './c-header.component';

const meta: Meta<CHeaderComponent> = {
  title: 'Header UI Component',
  component: CHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([], withDisabledInitialNavigation()),
        provideIcons({ matPayments, matArrowBack }),
      ],
    }),
  ],
  argTypes: {
    backUrl: {
      control: 'text',
      description:
        'Ruta de redirección para el botón de regresar. Si es nula, el botón no se muestra.',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<CHeaderComponent>;

export const Default: Story = {
  args: {
    backUrl: null,
  },
};

export const ConVolver: Story = {
  args: {
    backUrl: '/dashboard',
  },
};
