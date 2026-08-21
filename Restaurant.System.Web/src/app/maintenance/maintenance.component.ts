import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../core/services/core.service';
import { LayoutService } from '../core/services/layout.service';
import { CONFIG_REGISTRY, MaintenanceConfig } from './maintenance.entity';
import { BaseDto } from '../shared/models/dtos/base/base.dto';
import { DataGridComponent } from '../shared/controls/data-grid-component/data-grid.component';
import { DataGridActionEvent } from '../shared/controls/data-grid-component/data-grid';
import { DialogService } from '@LeeZX24/dialogs';
import { MaintenanceFormGroup } from './maintenance.form-group';
import { MaintenanceFormComponent } from './forms/form.component';
import { MaintenanceService } from '../core/services/api/maintenance.service';

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
export class MaintenanceComponent<TFormGroup extends MaintenanceFormGroup<T>, T extends BaseDto> implements OnInit {
  private coreService = inject(CoreService);
  private route = inject(ActivatedRoute);
  private layout = inject(LayoutService);
  private dialogService = inject(DialogService);
  protected maintenanceService = inject(MaintenanceService);

  module = input<string>('');

  config = computed<MaintenanceConfig<TFormGroup, T>>(() => {
    const key = this.module().toLowerCase();
    return CONFIG_REGISTRY[key as keyof typeof CONFIG_REGISTRY] as unknown as MaintenanceConfig<TFormGroup, T>;
  });

  rows = signal<T[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.maintenanceService.setSubRoute(this.config().route);
    this.fetch();
  }

  fetch() {
    this.maintenanceService.getList<T>().subscribe({
      next: (res) => {
        this.rows.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.rows.set([]);
        this.loading.set(false);
      }
    });
    // this.coreService
    //   .getList<T>(config.route, config.endpoints.list)
    //   .pipe(delay(2000)) // 2 seconds
    //   .subscribe({
    //     next: (res) => {
    //       this.rows.set(res);
    //       this.loading.set(false);
    //     },
    //     error: () => {
    //       this.rows.set([]);
    //       this.loading.set(false);
    //     }
    //   });
  }

  onDelete(item: T) {
    this.dialogService.showWarningDialog(`Are you sure to delete this item?`, 'Delete Item' , false, true).afterClosed().subscribe((result)=> {
      if(result) {
        this.maintenanceService.removeItem<T>(item).subscribe(() => {
          this.fetch();
        });
        // this.coreService
        // .removeItem<T>(this.config().route, this.config().endpoints.list, item)
        // .subscribe(() => {
        //   this.fetch();
        // });
      }
    });
  }

  createItemForm() {
    this.layout.open<MaintenanceFormComponent<TFormGroup, T>, unknown, T>(this.config().formComponent, {
      config: this.config(),
      action: 'create',
    });
  }

  onActionClicked($event: DataGridActionEvent<T>) {
    if ($event.action === 'edit') {
      this.updateItemForm($event.row);
    }

    if ($event.action === 'delete') {
      this.onDelete($event.row);
    }
  }

  updateItemForm(row: T) {
    this.layout.open<MaintenanceFormComponent<TFormGroup, T>, unknown, T>(this.config().formComponent, {
      config: this.config(),
      action: 'edit',
      item: row,
    });
  }
}
