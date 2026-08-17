import { Component, inject } from '@angular/core';
import { StaffMaintenanceFormGroup } from './staff-maintenance-form';
import { MaintenanceConfig } from '../../maintenance.entity';
import { StaffDto } from '../../../shared/models/dtos/staff.dto';
import { ControlService } from '../../../shared/services/control.service';
import { MaintenanceFormComponent } from '../form.component';

@Component({
  selector: 'rs-staff-maintenance-form',
  imports: [],
  template: ` <p>Staff-maintenance-form works!</p> `,
  styles: ``,
})
export class StaffMaintenanceFormComponent extends MaintenanceFormComponent<StaffMaintenanceFormGroup, StaffDto> {
  protected ctrlService = inject(ControlService);

  override prepareFormGroup(): StaffMaintenanceFormGroup {
    return new StaffMaintenanceFormGroup(this.ctrlService);
  }

  override getConfig(): MaintenanceConfig<StaffMaintenanceFormGroup, StaffDto> {
    return this.config;
  }
}
