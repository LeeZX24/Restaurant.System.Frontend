import { Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { BaseDto } from '../../models/dtos/base/base.dto';
import { DataGridAction, DataGridActionEvent, DataGridColumn, DataGridSearch } from '../data-grid-component/data-grid';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'rs-flex-data-grid',
  imports: [MatIconModule],
  templateUrl: './flex-data-grid.component.html',
  styleUrl: './flex-data-grid.component.css',
})
export class FlexDataGridComponent<T extends BaseDto> {
  columns = input.required<DataGridColumn<T>[]>();
  rows = input.required<T[]>();

  actions = input.required<DataGridAction[]>();
  pageSize = input(10);
  search = input<DataGridSearch<T> | null>(null);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  actionClicked = output<DataGridActionEvent<T>>();
  addItem = output();

  currentPage = signal(1);
  searchTerm = signal('');
  sortKey = signal<keyof T | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  totalPages = computed(() => {
    return Math.ceil(this.rows().length / this.pageSize());
  });

  pagedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.rows().slice(start, end);
  });

  placeholder = computed(() => {
    const placeholder = this.search()?.placeholder;
    if(!placeholder) return 'Search ...';
    return this.search()!.placeholder;
  });

  filteredRows = computed(() => {
    const data = this.rows();
    const term = this.searchTerm().trim().toLowerCase();
    const search = this.search();

    // no search → show all
    if (!search || !term) return data;

    // search active → return ONLY matches (can be empty)
    return data.filter(row =>
      search.predicate(row, term)
    );
  });

  sortedRows = computed(() => {
    const data = [...this.filteredRows()];

    const key = this.sortKey();
    const dir = this.sortDirection();

    if (!key) return data;

    return data.sort((a, b) => {
      const col = this.columns().find(c => c.key === key);

      const aVal = col ? this.getSortValue(a, col) : null;
      const bVal = col ? this.getSortValue(b, col) : null;

      const result =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));

      return dir === 'asc' ? result : -result;
    });
  });

  nextPage() {
    if(this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  previousPage() {
    if(this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages() },
      (_, i) => i + 1
    );
  }

  onActionClicked($event: DataGridActionEvent<T>) {
    this.actionClicked.emit($event);
  }

  applySearch(term: string) {
    this.searchTerm.set(term);
  }

  getColumnValue(row: T, column: DataGridColumn<T>) {
    if (column.columnValue) {
      return column.columnValue(row);
    }

    if (column.key) {
      return row[column.key];
    }

    return null;
  }

  getSortValue(row: T, column: DataGridColumn<T>) {
    if (column.columnValue) {
      return column.columnValue(row);
    }

    if (column.key) {
      return row[column.key];
    }

    return null;
  }

  onSort(column: DataGridColumn<T>) {
    if (!column.sortable) return;

    if (this.sortKey() === column.key) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortKey.set(column.key ?? null);
      this.sortDirection.set('asc');
    }
  }

  searchInputFocus() {
    this.searchInput.nativeElement.focus();
  }

  columnAlignment(column: DataGridColumn<T>) {
    switch(column.type) {
      case 'text':
      case 'date':
      case 'date-time':
      case 'time':
        return 'left';
      case 'amount':
      case 'number':
        return 'right';
      case 'boolean':
        return 'center';
      default:
        return 'left';
    }
  }
}
