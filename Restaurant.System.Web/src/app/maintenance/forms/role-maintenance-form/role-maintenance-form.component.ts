import { Component, inject } from '@angular/core';
import { MaintenanceConfig } from '../../maintenance.entity';
import { RoleDto } from '../../../shared/models/dtos/role.dto';
import { ControlService } from '../../../shared/services/control.service';
import { RoleMaintenanceFormGroup } from './role-maintenance-form';
import { MaintenanceFormComponent } from '../form.component';
import { CustomButtonControl } from '../../../shared/controls/custom-button-control/custom-button-control';
import { RSLabelTextFormControlComponent } from '@LeeZX24/forms';

@Component({
  selector: 'app-role-maintenance-form',
  imports: [CustomButtonControl, RSLabelTextFormControlComponent],
  template: `
    <div class="form-container">
      <div class="form-content">
        <rs-label-text-form-control [fc]="form.roleCodeFC"></rs-label-text-form-control>
        <rs-label-text-form-control [fc]="form.roleNameFC"></rs-label-text-form-control>
      </div>

      <div class="form-actions">
        <rs-button-control [cssClass]="'btn-primary'" [label]="this.itemData().action === 'create' ? 'Create' : 'Update'" (buttonClicked)="processSubmit()"></rs-button-control>
        <rs-button-control [cssClass]="'btn-secondary'"[label]="'Close'"  (buttonClicked)="close()"></rs-button-control>
      </div>
    </div>
  `,
  styles: ``,
})
export class RoleMaintenanceFormComponent extends MaintenanceFormComponent<RoleMaintenanceFormGroup, RoleDto> {
  protected ctrlService = inject(ControlService);
  override prepareFormGroup(): RoleMaintenanceFormGroup {
    return new RoleMaintenanceFormGroup(this.ctrlService);
  }
  override getConfig(): MaintenanceConfig<RoleMaintenanceFormGroup, RoleDto> {
    return this.config;
  }

  override ValidateForm(): boolean {
    return true;
  }
}
