import { Directive, OnInit, computed, inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CoreService } from "../../core/services/core.service";
import { LayoutRef } from "../../shared/layouts/layout-ref";
import { LayoutComponent } from "../../shared/layouts/layout.component";
import { MaintenanceConfig } from "../maintenance.entity";
import { MaintenanceFormGroup } from "../maintenance.form-group";
import { BaseDto } from "../../shared/models/dtos/base/base.dto";

@Directive()
export abstract class MaintenanceFormComponent<TFormGroup extends MaintenanceFormGroup<T>, T extends BaseDto> implements LayoutComponent<T>, OnInit {
  config!: MaintenanceConfig<TFormGroup, T>;
  controller!: LayoutRef<T>;
  abstract prepareFormGroup(data: T): TFormGroup;
  abstract getConfig(): MaintenanceConfig<TFormGroup, T>;
  private coreService = inject(CoreService);

  dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  sheetData = inject(MAT_BOTTOM_SHEET_DATA, { optional: true });

  data = this.dialogData ?? this.sheetData;

  form = computed(() => this.prepareFormGroup(this.data));

  ngOnInit() {
    if (this.data.config) this.config = this.data.config;
  }
  
  processSubmit()
  {
    if (this.ValidateForm()) {
      if (this.data.action == 'create')
        this.coreService
          .addNewItem(this.config.route, this.config.endpoints.create, this.form().getRawValue())
          .subscribe({
            next: (res) => this.success(res),
            error: () => this.error(),
          });

      if (this.data.action == 'edit')
        this.coreService.updateCurrentItem(
          this.config.route,
          this.config.endpoints.update,
          this.form().getRawValue(),
        );
    }
  }

  ValidateForm() {
    if (this.form().valid) return true;
    return false;
  }

  success(result: T) {
    this.close(result);
  }

  error() {
    this.close();
  }

  close(result?: T) {
    this.controller.close(result);
  }

//   createListFormGroup(item: RoleDto) {
//     const fg = new ObjectFormGroup<RoleDto>();

//     fg._addCustomControl(
//       this.roleKeys.roleCode,
//       this.ctrlService.LabelDropdownControl('Role', true, item.roleCode ?? ''),
//     );

//     return fg;
//   }
}
