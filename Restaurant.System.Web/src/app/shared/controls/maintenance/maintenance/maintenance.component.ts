import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../../core/services/core.service';
import { LayoutService } from '../../../../core/services/layout.service';
import { MaintenanceFormComponent } from './form/form.component';
import {
  ConfigOf,
  MaintenanceModule,
  CONFIG_REGISTRY,
  TableActionEvent,
} from './maintenance.entity';
import { MaintenanceTableComponent } from './table/table.component';
import { BaseDto } from '../../../models/dtos/base/base.dto';
import { delay } from 'rxjs';

@Component({
  selector: 'rs-maintenance',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaintenanceTableComponent,
    MatIconModule,
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.css',
})
export class MaintenanceComponent<T extends BaseDto> implements OnInit {
  private coreService = inject(CoreService);
  private route = inject(ActivatedRoute);
  private layout = inject(LayoutService);

  config!: ConfigOf<MaintenanceModule>;
  rows = signal<T[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.route.paramMap.subscribe((map) => {
      const module = map.get('module');

      if (!module) return;

      if (!(module in CONFIG_REGISTRY)) return;

      const typedModule = module as MaintenanceModule;
      const config = CONFIG_REGISTRY[typedModule];

      this.load(config);
    });
  }

  load<M extends MaintenanceModule>(config: ConfigOf<M>) {
    this.config = config;
    this.fetch();
  }

  fetch() {
    this.coreService
      .getList<T>(this.config.route, this.config.endpoints.list)
      .pipe(delay(2000)) // 2 seconds
      .subscribe((res) => {
        this.rows.set(res);
        this.loading.set(false);
      });
  }

  onDelete(item: T) {
    this.coreService
      .removeItem<T>(this.config.route, this.config.endpoints.list, item)
      .subscribe(() => {
        this.fetch();
      });
  }

  createItemForm() {
    this.layout.open(MaintenanceFormComponent<T>, {
      config: this.config,
      action: 'create',
    });
  }

  onActionClicked($event: TableActionEvent<T>) {
    if ($event.action === 'edit') {
      this.updateItemForm($event.row);
    }

    if ($event.action === 'edit') {
      this.onDelete($event.row);
    }
  }

  updateItemForm(row: T) {
    this.layout.open(MaintenanceFormComponent<T>, {
      config: this.config,
      action: 'edit',
      item: row,
    });
  }
}
