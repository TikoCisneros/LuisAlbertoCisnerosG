import { Meta, StoryObj } from '@storybook/angular';
import { CTableComponent } from './c-table.component';
import { TableColumn } from './c-table.interface';

interface Product {
  id: string;
  name: string;
  logo: string;
  price: number;
  date: string;
}

const mockColumns: TableColumn<Product>[] = [
  { key: 'logo', header: 'Logo', type: 'image' },
  { key: 'name', header: 'Nombre' },
  { key: 'price', header: 'Precio' },
  { key: 'date', header: 'Fecha', type: 'date' },
];

const mockData: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    logo: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&auto=format&fit=crop',
    price: 999,
    date: '2026-06-02',
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    logo: '',
    price: 1099,
    date: '2026-05-15',
  },
  {
    id: '3',
    name: 'iPad Pro',
    logo: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&auto=format&fit=crop',
    price: 799,
    date: '2026-04-20',
  },
];

const meta: Meta<CTableComponent<Product>> = {
  title: 'Table UI Component',
  component: CTableComponent,
  tags: ['autodocs'],
  render: (args: Record<string, any>) => ({
    props: {
      ...args,
    },
    template: `
      <c-table
        [data]="data"
        [columns]="columns"
        [showActions]="showActions"
        [isLoading]="isLoading"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></c-table>
    `,
  }),
  argTypes: {
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
  },
};

export default meta;

type Story = StoryObj<CTableComponent<Product>>;

export const Default: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
    showActions: false,
    isLoading: false,
  },
};

export const WithActions: Story = {
  args: {
    columns: mockColumns,
    data: mockData,
    showActions: true,
    isLoading: false,
  },
};

export const Empty: Story = {
  args: {
    columns: mockColumns,
    data: [],
    showActions: false,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    columns: mockColumns,
    data: [],
    showActions: true,
    isLoading: true,
  },
};
