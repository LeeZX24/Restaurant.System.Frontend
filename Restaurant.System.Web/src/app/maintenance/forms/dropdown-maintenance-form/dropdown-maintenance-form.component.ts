import { Component, inject } from '@angular/core';
import { DropdownMaintenanceFormGroup } from './dropdown-maintenance-form';
import { MaintenanceConfig } from '../../maintenance.entity';
import { DropdownDto } from '../../../shared/models/dtos/dropdown.dto';
import { ControlService } from '../../../shared/services/control.service';
import { MaintenanceFormComponent } from '../form.component';
import { CustomButtonControl } from "../../../shared/controls/custom-button-control/custom-button-control";
import { CustomToggleControl } from "../../../shared/controls/custom-toggle-control/custom-toggle-control";
import { RSLabelTextFormControlComponent } from "@rs/forms";
import { RSLabelDropdownFormControlComponent } from "../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control.component";
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'rs-dropdown-maintenance-form',
  template: `
    <div class="form-container">
      <div class="form-content">
        <!-- <div>
          <span>Create new category ?</span>
          <rs-toggle></rs-toggle>
        </div> -->
        <div>
          <rs-label-text-form-control [fc]="form().categoryTextFC"></rs-label-text-form-control>
          <rs-label-dropdown-form-control [fc]="form().categoryDDFC"></rs-label-dropdown-form-control>
          <rs-label-text-form-control [fc]="form().codeFC"></rs-label-text-form-control>
          <rs-label-text-form-control [fc]="form().descriptionFC"></rs-label-text-form-control>
          <rs-label-text-form-control [fc]="form().seqNoFC"></rs-label-text-form-control>
        </div>
      </div>
      
      <div class="form-actions">
        <rs-button-control [cssClass]="'btn-primary'" [label]="this.data.action === 'create' ? 'Create' : 'Update'" (buttonClicked)="processSubmit()"></rs-button-control>
        <rs-button-control [cssClass]="'btn-secondary'"[label]="'Close'"  (buttonClicked)="close()"></rs-button-control>
      </div>
  </div>
  `,
  imports: [CustomButtonControl, RSLabelTextFormControlComponent, RSLabelDropdownFormControlComponent],
  providers: [provideNgxMask()]
})
export class DropdownMaintenanceFormComponent extends MaintenanceFormComponent<DropdownMaintenanceFormGroup, DropdownDto> {
  protected ctrlService = inject(ControlService);

  override prepareFormGroup(): DropdownMaintenanceFormGroup {
    return new DropdownMaintenanceFormGroup(this.ctrlService);
  }
  override getConfig(): MaintenanceConfig<DropdownMaintenanceFormGroup, DropdownDto> {
    return this.config;
  }
}
