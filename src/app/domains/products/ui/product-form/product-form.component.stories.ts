import { Meta, StoryObj } from '@storybook/angular';
import { ProductFormComponent } from './product-form.component';

const meta: Meta<ProductFormComponent> = {
  title: 'Product Form',
  component: ProductFormComponent,
};

export default meta;

type Story = StoryObj<ProductFormComponent>;

export const CreateMode: Story = {
  render: (args) => ({
    props: args,
    template: `
      <product-form [initialValues]="initialValues" [isEditMode]="isEditMode"></product-form>
    `,
  }),
  args: {
    initialValues: null,
    isEditMode: false,
  },
};

export const EditMode: Story = {
  render: (args) => ({
    props: args,
    template: `
      <product-form [initialValues]="initialValues" [isEditMode]="isEditMode"></product-form>
    `,
  }),
  args: {
    initialValues: {
      id: 'visa-infinite',
      name: 'Tarjeta Visa Infinite',
      description: 'Tarjeta de crédito premium con excelentes beneficios y cashback.',
      logoURL: 'https://www.visa.com.ec/dam/IMAGEMARKETING/ecuador/logos/visa-infinite-800x450.png',
      releaseDate: new Date('2026-06-03'),
      revisionDate: new Date('2027-06-03'),
    },
    isEditMode: true,
  },
};
