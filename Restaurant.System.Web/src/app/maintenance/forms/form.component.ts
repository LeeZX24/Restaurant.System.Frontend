
import { config } from './../../app.config.server';
import { Directive, OnInit, computed, inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LayoutRef } from "../../shared/layouts/layout-ref";
import { LayoutComponent } from "../../shared/layouts/layout.component";
import { MaintenanceConfig } from "../maintenance.entity";
import { MaintenanceFormGroup } from "../maintenance.form-group";
import { BaseDto } from "../../shared/models/dtos/base/base.dto";
import { LayoutData } from "../../shared/layouts/layout-data";
import { MaintenanceService } from '../../core/services/api/maintenance.service';

@Directive()
export abstract class MaintenanceFormComponent<TFormGroup extends MaintenanceFormGroup<T>, T extends BaseDto> implements LayoutComponent<T>, OnInit {
  config!: MaintenanceConfig<TFormGroup, T>;
  controller!: LayoutRef<T>;
  data!: LayoutData<T>;

  abstract prepareFormGroup(data: T): TFormGroup;
  abstract getConfig(): MaintenanceConfig<TFormGroup, T>;
  private maintenanceService = inject(MaintenanceService);

  dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  itemData = computed(() => this.dialogData ?? this.sheetData );

  form!: TFormGroup;

  ngOnInit() {
    if (config) this.config = this.itemData().config;
  }

  processSubmit()
  {
    if (this.ValidateForm()) {
      if (this.itemData().action == 'create')
        this.maintenanceService.addNewItem<T>(this.form.getRawValue())
        .subscribe({
          next: (res) => this.success(res),
          error: () => this.error(),
        });

      if (this.itemData().action == 'edit')
        this.maintenanceService.updateCurrentItem<T>(this.form.getRawValue())
        .subscribe({
          next: (res) => this.success(res),
          error: () => this.error(),
        });
    }
  }

  abstract ValidateForm(): boolean;

  success(result: T) {
    this.close(result);
  }

  error() {
    this.close();
  }

  close(result?: T) {
    this.controller.close(result);
  }
}
