import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CTableComponent } from './c-table.component';
import { TableColumn } from './c-table.interface';
import { vi, describe, it, expect } from 'vitest';

interface TestItem {
  id: string;
  name: string;
  date: string;
}

describe('Pruebas de CTableComponent', () => {
  const mockColumns: TableColumn<TestItem>[] = [
    { key: 'id', header: 'ID', type: 'text' },
    { key: 'name', header: 'Nombre', type: 'text' },
  ];

  const mockData: TestItem[] = [
    { id: '1', name: 'Producto A', date: '2026-06-02' },
    { id: '2', name: 'Producto B', date: '2026-06-03' },
  ];

  it('deberia renderizar correctamente', async () => {
    await render(CTableComponent, {
      inputs: {
        columns: mockColumns,
        data: mockData,
      },
    });

    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Nombre')).toBeDefined();

    expect(screen.getByText('Producto A')).toBeDefined();
    expect(screen.getByText('Producto B')).toBeDefined();
  });

  it('debria mostrar mensaje si los datos son vacíos', async () => {
    await render(CTableComponent, {
      inputs: {
        columns: mockColumns,
        data: [],
      },
    });

    expect(screen.getByText('No se encontraron registros.')).toBeDefined();
  });

  it('deberia ejecutar las acciones correctamente', async () => {
    const editSpy = vi.fn();
    const deleteSpy = vi.fn();

    await render(CTableComponent, {
      inputs: {
        columns: mockColumns,
        data: [mockData[0]],
        showActions: true,
      },
      on: {
        onEdit: editSpy,
        onDelete: deleteSpy,
      },
    });

    const user = userEvent.setup();

    // Abrir menú de acciones haciendo clic en los puntos suspensivos verticales
    const toggleBtn = screen.getByRole('button', { name: 'Acciones' });
    await user.click(toggleBtn);

    // Clic en Editar
    const editBtn = screen.getByRole('button', { name: 'Editar' });
    await user.click(editBtn);
    expect(editSpy).toHaveBeenCalledWith(mockData[0]);

    // Abrir nuevamente
    await user.click(toggleBtn);

    // Clic en Eliminar
    const deleteBtn = screen.getByRole('button', { name: 'Eliminar' });
    await user.click(deleteBtn);
    expect(deleteSpy).toHaveBeenCalledWith(mockData[0]);
  });
});
