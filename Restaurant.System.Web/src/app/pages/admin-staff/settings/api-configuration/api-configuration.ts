import { MatDialogRef } from '@angular/material/dialog';
import { Component, inject, signal } from '@angular/core';
import { CustomButtonControl } from "../../../../shared/controls/custom-button-control/custom-button-control";
import { FlexDataGridComponent } from "../../../../shared/controls/flex-data-grid/flex-data-grid.component";
import { DataGridAction, DataGridColumn } from '../../../../shared/controls/data-grid-component/data-grid';
import { BaseDto } from '../../../../shared/models/dtos/base/base.dto';

@Component({
  selector: 'app-api-configuration',
  imports: [CustomButtonControl, FlexDataGridComponent],
  templateUrl: './api-configuration.html',
  styleUrl: './api-configuration.css',
})
export class ApiConfiguration<T extends BaseDto> {
  dialog = inject(MatDialogRef<ApiConfiguration<T>>);
  columns: DataGridColumn<T>[] = [
    { label: 'Name', width:'70px' },
    { label: 'Endpoint', width: '150px' },
    { label: 'Full Name', width: '150px'
    },
  ];

  actions:DataGridAction[] = [
    { key: 'confirm', label: 'Confirm', icon: 'confirm' },
    { key: 'cancel', label: 'Cancel', icon: 'cancel' },
  ];

    rows = signal<T[]>([]);
}
