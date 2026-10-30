
import { config } from './../../app.config.server';
import { Directive, OnInit, computed, inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LayoutRef } from "../../shared/layouts/layout-ref";
import { LayoutComponent } from "../../shared/layouts/layout.component";
import { MaintenanceConfig } from "../maintenance.entity";
import { MaintenanceFormGroup } from "../maintenance.form-group";
import { LayoutData } from "../../shared/layouts/layout-data";
import { MaintenanceService } from '../../core/services/api/maintenance.service';
import { BaseDto } from '../../shared/models/dtos/base.dto';
import { DialogService, DialogVariant } from '@LeeZX24/dialogs';

@Directive()
export abstract class MaintenanceFormComponent<TFormGroup extends MaintenanceFormGroup<T>, T extends BaseDto> implements LayoutComponent<T>, OnInit {
  config!: MaintenanceConfig<TFormGroup, T>;
  controller!: LayoutRef<T>;
  data!: LayoutData<T>;

  abstract prepareFormGroup(data: T): TFormGroup;
  abstract getConfig(): MaintenanceConfig<TFormGroup, T>;
  private maintenanceService = inject(MaintenanceService);
  private dialogService = inject(DialogService);

  dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  itemData = computed(() => this.dialogData ?? this.sheetData );

  form!: TFormGroup;

  ngOnInit() {
    if (config) this.config = this.itemData().config;
  }

  async processSubmit()
  {
    const ref = await this.dialogService.showLoadingDialog('Loading ...');

    ref.afterOpened().subscribe(async () => {
      if (this.ValidateForm()) {
        if (this.itemData().action == 'create') {
          const addLoadingConfig = this.dialogService.getDialogConfig(DialogVariant.Info, { loading: true });

          await this.dialogService.updateDialog(ref, { ...addLoadingConfig, message: 'Creating Item ...', title: 'Create New Item - Maintenance' });

          await this.maintenanceService.addNewItem<T>(this.form.getRawValue())
          .subscribe({
            next: async (res) => {

              const addSuccessConfig = this.dialogService.getDialogConfig(DialogVariant.Success, { success: true });

              await this.dialogService.updateDialog(ref, { ...addSuccessConfig, message: 'Create Item Successful.', title: 'Create New Item Success - Maintenance' });

              this.success(res as T);
            },
            error: async (error) => {
              const addErrorConfig = this.dialogService.getDialogConfig(DialogVariant.Error);

              await this.dialogService.updateDialog(ref, { ...addErrorConfig, message: `Error - ${error}`, title: 'Create New Item Error - Maintenance' });
              this.error();
            },
          });
        }

        if (this.itemData().action == 'edit') {
          const updateLoadingConfig = this.dialogService.getDialogConfig(DialogVariant.Info, { loading: true });

          await this.dialogService.updateDialog(ref, { ...updateLoadingConfig, message: 'Updating Item ...', title: 'Update Existing Item - Maintenance' });

          await this.maintenanceService.updateCurrentItem<T>(this.form.getRawValue())
          .subscribe({
            next: async (res) => {
              const updateSuccessConfig = this.dialogService.getDialogConfig(DialogVariant.Success, {success: true });

              await this.dialogService.updateDialog(ref, { ...updateSuccessConfig, message: 'Update Item Successful.', title: 'Update Existing Item Success - Maintenance' });

              this.success(res as T);
            },
            error: async (error) => {
              const updateErrorConfig = this.dialogService.getDialogConfig(DialogVariant.Error);

              await this.dialogService.updateDialog(ref, { ...updateErrorConfig, message: `Error - ${error}`, title: 'Create New Item Error - Maintenance' });

              this.error();
            }
          });
        }
      } else {
        const errorConfig = this.dialogService.getDialogConfig(DialogVariant.Error);

        await this.dialogService.updateDialog(ref, { ...errorConfig, message: 'Error creating and updating item!', title: 'Error - Maintenance' });
      }
    });

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
