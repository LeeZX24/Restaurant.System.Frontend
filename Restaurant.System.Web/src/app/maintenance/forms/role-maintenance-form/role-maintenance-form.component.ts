import { Component, inject } from '@angular/core';
import { MaintenanceConfig } from '../../maintenance.entity';
import { RoleDto } from '../../../shared/models/dtos/role.dto';
import { ControlService } from '../../../shared/services/control.service';
import { RoleMaintenanceFormGroup } from './role-maintenance-form';
import { MaintenanceFormComponent } from '../form.component';

@Component({
  selector: 'app-role-maintenance-form',
  imports: [],
  template: ` <p>Role-maintenance-form works!</p> `,
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
}
