import { Meta, StoryObj } from '@storybook/angular';
import { CSkeletonComponent } from './c-skeleton.component';

const meta: Meta<CSkeletonComponent> = {
  title: 'Skeleton UI Component',
  component: CSkeletonComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 20px; background-color: var(--bg-primary, #ffffff); max-width: 500px;">
        <c-skeleton [width]="width" [height]="height"></c-skeleton>
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<CSkeletonComponent>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '1rem',
  },
};

export const CustomSize: Story = {
  args: {
    width: '300px',
    height: '40px',
  },
};

export const CardLayout: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 300px; display: flex; flex-direction: column; gap: 12px; background-color: #ffffff;">
        <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden;">
          <c-skeleton width="100%" height="100%"></c-skeleton>
        </div>
        <c-skeleton width="80%" height="1.25rem"></c-skeleton>
        <c-skeleton width="100%" height="0.85rem"></c-skeleton>
        <c-skeleton width="90%" height="0.85rem"></c-skeleton>
      </div>
    `,
  }),
};
