import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../../core/services/core.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { MaintenanceFormComponent } from './form/form.component';
import { CONFIG_REGISTRY, MaintenanceConfig } from './maintenance.entity';
import { BaseDto } from '../../../models/dtos/base/base.dto';
import { delay } from 'rxjs';
import { DataGridComponent } from '../../data-grid-component/data-grid.component';
import { DataGridActionEvent } from '../../data-grid-component/data-grid';
import { DialogService } from '@rs/dialogs';

@Component({
  selector: 'rs-maintenance',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    DataGridComponent
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css',
})
export class MaintenanceComponent implements OnInit {
  private coreService = inject(CoreService);
  private route = inject(ActivatedRoute);
  private layout = inject(LayoutService);
  private dialogService = inject(DialogService);

  module = input<string>('');

  config = computed<MaintenanceConfig<BaseDto> | null>(() => {
    const key = this.module().toLowerCase();
    if(key in CONFIG_REGISTRY) {
      return CONFIG_REGISTRY[key as keyof typeof CONFIG_REGISTRY] as unknown as MaintenanceConfig<BaseDto>;
    }

    return null;
  });

  rows = signal<BaseDto[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    const config = this.config() as MaintenanceConfig<BaseDto>;
    this.coreService
      .getList<BaseDto>(config.route, config.endpoints.list)
      .pipe(delay(2000)) // 2 seconds
      .subscribe({
        next: (res) => {
          this.rows.set(res);
          this.loading.set(false);
        },
        error: () => {
          this.rows.set([]);
          this.loading.set(false);
        }
      });
  }

  onDelete<T extends BaseDto>(item: T) {
    const config = this.config() as MaintenanceConfig<BaseDto>;
    this.dialogService.showWarningDialog(`Are you sure to delete this item?`, 'Delete Item' , false, true).afterClosed().subscribe((result)=> {
      if(result) {
        this.coreService
        .removeItem<BaseDto>(config.route, config.endpoints.list, item)
        .subscribe(() => {
          this.fetch();
        });
      }
    });
  }

  createItemForm() {
    this.layout.open<MaintenanceFormComponent<BaseDto>, unknown, BaseDto>(MaintenanceFormComponent<BaseDto>, {
      config: this.config(),
      action: 'create',
    });
  }

  onActionClicked($event: DataGridActionEvent<BaseDto>) {
    if ($event.action === 'edit') {
      this.updateItemForm($event.row);
    }

    if ($event.action === 'delete') {
      this.onDelete($event.row);
    }
  }

  updateItemForm(row: BaseDto) {
    this.layout.open<MaintenanceFormComponent<BaseDto>, unknown, BaseDto>(MaintenanceFormComponent<BaseDto>, {
      config: this.config(),
      action: 'edit',
      item: row,
    });
  }
}
