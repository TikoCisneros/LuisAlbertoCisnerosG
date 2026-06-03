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

  onPageChange = output<number>();
  onPageSizeChange = output<number>();

  totalPages = computed(() => {
    return Math.ceil(this.totalResults() / this.pageSize()) || 1;
  });

  onPageChangeHandler(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.onPageChange.emit(page);
    }
  }

  onPageSizeChangeHandler(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.onPageSizeChange.emit(Number(selectElement.value));
  }
}
