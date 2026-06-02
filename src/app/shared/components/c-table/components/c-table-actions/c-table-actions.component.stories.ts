import { Meta, StoryObj } from '@storybook/angular';
import { CTableActionsComponent } from './c-table-actions.component';

const meta: Meta<CTableActionsComponent> = {
  title: 'Table Actions UI Component',
  component: CTableActionsComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 100px; display: flex; justify-content: center;">
        <c-table-actions
          [item]="item"
          (edit)="edit($event)"
          (delete)="delete($event)"
        ></c-table-actions>
      </div>
    `,
  }),
  argTypes: {
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
  },
};

export default meta;

type Story = StoryObj<CTableActionsComponent>;

export const Default: Story = {
  args: {
    item: { id: '123', name: 'Product Example' },
  },
};
