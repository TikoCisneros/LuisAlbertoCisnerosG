import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from './c-table.interface';
import { CLogoComponent } from '@shared/components/c-logo/c-logo.component';
import { CTableActionsComponent } from './components/c-table-actions/c-table-actions.component';
import { CSkeletonComponent } from '@shared/components/c-skeleton/c-skeleton.component';

@Component({
  selector: 'c-table',
  standalone: true,
  imports: [DatePipe, CLogoComponent, CTableActionsComponent, CSkeletonComponent],
  templateUrl: './c-table.component.html',
  styleUrl: './c-table.component.scss',
})
export class CTableComponent<T> {
  // Configuraciones
  data = input.required<T[]>();
  columns = input.required<TableColumn<T>[]>();
  showActions = input<boolean>(false);
  isLoading = input<boolean>(false);

  // Eventos
  onEdit = output<T>();
  onDelete = output<T>();

  resolveValue(item: any, key: string): any {
    const value = item[key];
    if (value instanceof Date && isNaN(value.getTime())) {
      return null;
    }
    return value;
  }

  trackByFn(item: T): unknown {
    return (item as any)?.['id'] || item;
  }

  onEditHandler(item: T) {
    this.onEdit.emit(item);
  }

  onDeleteHandler(item: T) {
    this.onDelete.emit(item);
  }
}
