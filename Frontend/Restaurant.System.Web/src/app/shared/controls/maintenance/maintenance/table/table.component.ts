import { CommonModule } from '@angular/common';
import { Component, OnInit, input, output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TableAction, TableActionEvent } from '../maintenance.entity';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BaseDto } from '../../../../models/dtos/base/base.dto';

@Component({
  selector: 'rs-maintenance-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class MaintenanceTableComponent<T extends BaseDto> implements OnInit {
  columns = input<{ key: string; label: string }[]>([]);
  rows = input<T[]>([]);

  // columns = input<MaintenanceColumn<BaseDto>[]>([]);
  // rows = input<BaseDto[]>([]);
  skeletonRows = Array(5).fill({});
  loading = input(false);
  actions = input<TableAction[]>();

  actionClicked = output<TableActionEvent<T>>();

  ngOnInit(): void {
    console.log(this.rows());
  }

  displayedColumns() {
    return [...this.columns().map((c) => c.key), 'actions'];
  }
}
