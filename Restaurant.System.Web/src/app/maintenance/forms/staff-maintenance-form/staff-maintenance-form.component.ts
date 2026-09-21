import { Component, inject } from '@angular/core';
import { StaffMaintenanceFormGroup } from './staff-maintenance-form';
import { MaintenanceConfig } from '../../maintenance.entity';
import { StaffDto } from '../../../shared/models/dtos/staff.dto';
import { ControlService } from '../../../shared/services/control.service';
import { MaintenanceFormComponent } from '../form.component';
import { CustomButtonControl } from '../../../shared/controls/custom-button-control/custom-button-control';
import { RSLabelTextFormControlComponent, RSLabelPasswordFormControlComponent, RSLabelEmailFormControlComponent } from '@LeeZX24/forms';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'rs-staff-maintenance-form',
  imports: [CustomButtonControl, RSLabelTextFormControlComponent, RSLabelPasswordFormControlComponent, RSLabelEmailFormControlComponent],
  template: `
    <div class="form-container">
      <div class="form-content"> 
        <rs-label-text-form-control [fc]="form.usernameFC"></rs-label-text-form-control>
        <rs-label-password-form-control [fc]="form.passwordFC" [labelSize]="'w-4/12'" [inputSize]="'w-8/12'"></rs-label-password-form-control>
        <rs-label-text-form-control [fc]="form.firstNameFC"></rs-label-text-form-control>
        <rs-label-text-form-control [fc]="form.lastNameFC"></rs-label-text-form-control>
        <rs-label-email-form-control [fc]="form.emailFC" [labelSize]="'w-4/12'" [inputSize]="'w-8/12'"></rs-label-email-form-control>
      </div>

      <div class="form-actions">
        <rs-button-control [cssClass]="'btn-primary'" [label]="this.itemData().action === 'create' ? 'Create' : 'Update'" (buttonClicked)="processSubmit()"></rs-button-control>
        <rs-button-control [cssClass]="'btn-secondary'"[label]="'Close'"  (buttonClicked)="close()"></rs-button-control>
      </div>
    </div>
  `,
  styles: ``,
  providers: [provideNgxMask()]
})
export class StaffMaintenanceFormComponent extends MaintenanceFormComponent<StaffMaintenanceFormGroup, StaffDto> {
  protected ctrlService = inject(ControlService);

  override prepareFormGroup(data?: StaffDto): StaffMaintenanceFormGroup {
    return new StaffMaintenanceFormGroup(this.ctrlService, data, );
  }

  override getConfig(): MaintenanceConfig<StaffMaintenanceFormGroup, StaffDto> {
    return this.config;
  }

  override ngOnInit() {
    this.form = this.prepareFormGroup(this.itemData().item);
  }

  override ValidateForm(): boolean {
    this.form.markAllAsTouched();
    if(this.form.invalid) {

      return false;
    }
    return true;
  }
}
