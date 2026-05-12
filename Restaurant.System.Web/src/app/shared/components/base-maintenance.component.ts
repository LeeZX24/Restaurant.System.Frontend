import { Directive, inject, OnInit } from '@angular/core';
import { CoreService } from '../../core/services/core.service';
import { BaseDto } from '../models/dtos/base/base.dto';

@Directive()
export abstract class BaseMaintenanceComponent<T extends BaseDto> implements OnInit {
  private coreService = inject(CoreService);
  rows: T[] = [];
  loading = false;

  abstract route: string;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.coreService.getList<T>(this.route, 'list').subscribe({
      next: (res) => {
        this.rows = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  refresh() {
    this.loadData();
  }
}
