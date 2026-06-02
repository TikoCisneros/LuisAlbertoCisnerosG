import { Meta, StoryObj } from '@storybook/angular';
import { CLogoComponent } from './c-logo.component';

const meta: Meta<CLogoComponent> = {
  title: 'Logo UI Component',
  component: CLogoComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <c-logo 
        [src]="src" 
        [fallbackName]="fallbackName"
      ></c-logo>
    `,
  }),
};

export default meta;

type Story = StoryObj<CLogoComponent>;

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&auto=format&fit=crop',
    fallbackName: 'iPhone 15 Pro',
  },
};

export const FallbackInitials: Story = {
  args: {
    src: null,
    fallbackName: 'MacBook Air M3',
  },
};

export const BrokenImage: Story = {
  args: {
    src: 'https://invalid-image-url.com/broken.jpg',
    fallbackName: 'iPad Pro',
  },
};
