import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CPaginationComponent } from './c-pagination.component';
import { vi, describe, it, expect } from 'vitest';

describe('CPaginationComponent', () => {
  it('should render results count and page navigation information', async () => {
    await render(CPaginationComponent, {
      inputs: {
        totalResults: 17,
        pageSize: 5,
        currentPage: 1,
      },
    });

    expect(screen.getByText('17 Resultados')).toBeDefined();
    expect(screen.getByText('Pág. 1 de 4')).toBeDefined();
  });

  it('should emit pageChange when navigation buttons are clicked', async () => {
    const pageChangeSpy = vi.fn();

    await render(CPaginationComponent, {
      inputs: {
        totalResults: 20,
        pageSize: 5,
        currentPage: 2,
      },
      on: {
        onPageChange: pageChangeSpy,
      },
    });

    const user = userEvent.setup();

    // Click página siguiente
    const nextBtn = screen.getByRole('button', { name: /página siguiente/i });
    await user.click(nextBtn);
    expect(pageChangeSpy).toHaveBeenCalledWith(3);

    // Click página anterior
    const prevBtn = screen.getByRole('button', { name: /página anterior/i });
    await user.click(prevBtn);
    expect(pageChangeSpy).toHaveBeenCalledWith(1);
  });

  it('should disable prev page button on first page and next page button on last page', async () => {
    const { fixture } = await render(CPaginationComponent, {
      inputs: {
        totalResults: 10,
        pageSize: 5,
        currentPage: 1,
      },
    });

    const prevBtn = screen.getByRole('button', { name: /página anterior/i }) as HTMLButtonElement;
    const nextBtn = screen.getByRole('button', { name: /página siguiente/i }) as HTMLButtonElement;

    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    // Mover a la página 2 (última página)
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    expect(prevBtn.disabled).toBe(false);
    expect(nextBtn.disabled).toBe(true);
  });

  it('should emit pageSizeChange when records selector changes', async () => {
    const pageSizeChangeSpy = vi.fn();

    await render(CPaginationComponent, {
      inputs: {
        totalResults: 20,
        pageSize: 5,
        currentPage: 1,
      },
      on: {
        onPageSizeChange: pageSizeChangeSpy,
      },
    });

    const user = userEvent.setup();
    const select = screen.getByRole('combobox', { name: /cantidad de registros por página/i });
    await user.selectOptions(select, '10');

    expect(pageSizeChangeSpy).toHaveBeenCalledWith(10);
  });
});
