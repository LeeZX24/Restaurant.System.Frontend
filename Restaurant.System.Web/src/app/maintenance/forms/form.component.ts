
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
import { ref } from 'node:process';

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
    const ref = await this.dialogService.showLoadingDialog('Loading ...', false, false, { loading: true });

    ref.afterOpened().subscribe(async () => {
      if (this.ValidateForm()) {
        if (this.itemData().action == 'create') {
          ref.update({
            message: 'Creating Item ...'
          })

          await this.maintenanceService.addNewItem<T>(this.form.getRawValue())
          .subscribe({
            next: (res) => {
              
              ref.update({
                message: 'Create Item Successful.',
                variant: DialogVariant.Success,
                extraConfig: { loading: false, success: true }
              });

              this.success(res as T);
            },
            error: (error) => {
              ref.update({
                message: `Error - ${error}`,
                variant: DialogVariant.Error,
                extraConfig: { loading: false }
              });

              this.error()
            },
          });
        }

        if (this.itemData().action == 'edit') {
          ref.update({
            message: 'Updating Item ...'
          })

          await this.maintenanceService.updateCurrentItem<T>(this.form.getRawValue())
          .subscribe({
            next: (res) => {
              ref.update({
                message: 'Update Item Successful.',
                variant: DialogVariant.Success,
                extraConfig: { loading: false, success: true }
              });
              this.success(res as T)
            },
            error: () => this.error(),
          });
        }
      } else {
        ref.update({
          message: 'Error creating item!',
          title: 'Error - Maintenance',
          variant: DialogVariant.Error,
          extraConfig: { loading: false },
          hasFooter: true,
          hasHeader: true,
        })
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
