import { Component, HostListener, ElementRef, inject, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMoreVert } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'c-table-actions',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ matMoreVert })],
  templateUrl: './c-table-actions.component.html',
  styleUrl: './c-table-actions.component.scss',
})
export class CTableActionsComponent {
  item = input.required<any>();

  onEdit = output<any>();
  onDelete = output<any>();

  isOpen = signal<boolean>(false);
  private elementRef = inject(ElementRef);

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((open) => !open);
  }

  onEditHandler(): void {
    this.onEdit.emit(this.item());
    this.isOpen.set(false);
  }

  onDeleteHandler(): void {
    this.onDelete.emit(this.item());
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
