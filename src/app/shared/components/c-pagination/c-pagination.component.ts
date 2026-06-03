import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matNavigateBefore, matNavigateNext } from '@ng-icons/material-icons/baseline';
import { CButtonComponent } from '../c-button/c-button.component';

@Component({
  selector: 'c-pagination',
  standalone: true,
  imports: [NgIcon, CButtonComponent],
  providers: [provideIcons({ matNavigateBefore, matNavigateNext })],
  templateUrl: './c-pagination.component.html',
  styleUrl: './c-pagination.component.scss',
})
export class CPaginationComponent {
  totalResults = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input.required<number>();

  pageChange = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => {
    return Math.ceil(this.totalResults() / this.pageSize()) || 1;
  });

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(selectElement.value));
  }
}
