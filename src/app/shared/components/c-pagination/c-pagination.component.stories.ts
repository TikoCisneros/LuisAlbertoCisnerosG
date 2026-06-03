import { Meta, StoryObj } from '@storybook/angular';
import { CPaginationComponent } from './c-pagination.component';

const meta: Meta<CPaginationComponent> = {
  title: 'Pagination UI Component',
  component: CPaginationComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <div style="padding: 20px; background-color: var(--bg-primary, #ffffff); border-radius: 8px;">
        <c-pagination
          [totalResults]="totalResults"
          [pageSize]="pageSize"
          [currentPage]="currentPage"
          (onPageChange)="pageChange($event)"
          (onPageSizeChange)="pageSizeChange($event)"
        ></c-pagination>
      </div>
    `,
  }),
  argTypes: {
    onPageChange: { action: 'pageChange' },
    onPageSizeChange: { action: 'pageSizeChange' },
  },
};

export default meta;

type Story = StoryObj<CPaginationComponent>;

export const FirstPage: Story = {
  args: {
    totalResults: 50,
    pageSize: 10,
    currentPage: 1,
  },
};

export const MiddlePage: Story = {
  args: {
    totalResults: 50,
    pageSize: 10,
    currentPage: 3,
  },
};

export const LastPage: Story = {
  args: {
    totalResults: 53,
    pageSize: 10,
    currentPage: 6,
  },
};

export const SinglePage: Story = {
  args: {
    totalResults: 5,
    pageSize: 10,
    currentPage: 1,
  },
};
