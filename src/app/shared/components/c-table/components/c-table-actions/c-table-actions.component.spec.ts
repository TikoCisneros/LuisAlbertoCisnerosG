import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CTableActionsComponent } from './c-table-actions.component';
import { vi, describe, it, expect } from 'vitest';

describe('CTableActionsComponent', () => {
  const mockItem = { id: '123', name: 'Product A' };

  it('should toggle dropdown visibility and emit edit/delete outputs appropriately', async () => {
    const editSpy = vi.fn();
    const deleteSpy = vi.fn();

    await render(CTableActionsComponent, {
      inputs: { item: mockItem },
      on: {
        onEdit: editSpy,
        onDelete: deleteSpy,
      },
    });

    const user = userEvent.setup();
    const toggleBtn = screen.getByRole('button', { name: 'Acciones' });

    await user.click(toggleBtn);
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    expect(editSpy).toHaveBeenCalledWith(mockItem);
    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();

    await user.click(toggleBtn);
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(deleteSpy).toHaveBeenCalledWith(mockItem);
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull();
  });
});
