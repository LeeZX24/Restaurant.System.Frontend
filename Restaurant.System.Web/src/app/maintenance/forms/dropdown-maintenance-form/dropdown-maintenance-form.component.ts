import { Component, inject, OnInit, signal } from '@angular/core';
import { DropdownMaintenanceFormGroup } from './dropdown-maintenance-form';
import { MaintenanceConfig } from '../../maintenance.entity';
import { DropdownDto } from '../../../shared/models/dtos/dropdown.dto';
import { ControlService } from '../../../shared/services/control.service';
import { MaintenanceFormComponent } from '../form.component';
import { CustomButtonControl } from "../../../shared/controls/custom-button-control/custom-button-control";
import { RSLabelTextFormControlComponent } from "@LeeZX24/forms";
import { provideNgxMask } from 'ngx-mask';
import { RSLabelDropdownFormControlComponent } from '../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control.component';
import { CustomLabelToggleFormControl } from '../../../shared/controls/custom-label-toggle-control/custom-label-toggle-form-control.component';

@Component({
  selector: 'rs-dropdown-maintenance-form',
  template: `
    <div class="form-container">
      <div class="form-content">
        @if(this.itemData().action === 'create') {
          <rs-label-toggle-form-control [fc]="form.isNewCategoryFC" (change)="OnToggleNewCategory()"></rs-label-toggle-form-control>
            @if(!isNewCategory()) { <rs-label-dropdown-form-control [fc]="form.categoryDDFC"></rs-label-dropdown-form-control> }
            @if(isNewCategory()) { <rs-label-text-form-control [fc]="form.categoryTextFC"></rs-label-text-form-control> }
        } 
        
        @if(this.itemData().action === 'edit') {
          <rs-label-text-form-control [fc]="form.categoryTextFC"></rs-label-text-form-control>
        }

        <rs-label-text-form-control [fc]="form.codeFC"></rs-label-text-form-control>
        <rs-label-text-form-control [fc]="form.descriptionFC"></rs-label-text-form-control>
        <rs-label-text-form-control [fc]="form.seqNoFC"></rs-label-text-form-control>
      </div>

      <div class="form-actions">
        <rs-button-control [cssClass]="'btn-primary'" [label]="this.itemData().action === 'create' ? 'Create' : 'Update'" (buttonClicked)="processSubmit()"></rs-button-control>
        <rs-button-control [cssClass]="'btn-secondary'"[label]="'Close'"  (buttonClicked)="close()"></rs-button-control>
      </div>
  </div>
  `,
  imports: [CustomButtonControl, RSLabelTextFormControlComponent, RSLabelDropdownFormControlComponent, CustomLabelToggleFormControl],
  providers: [provideNgxMask()]
})
export class DropdownMaintenanceFormComponent extends MaintenanceFormComponent<DropdownMaintenanceFormGroup, DropdownDto> implements OnInit {
  protected ctrlService = inject(ControlService);

  isNewCategory = signal(false);

  override prepareFormGroup(data?: DropdownDto): DropdownMaintenanceFormGroup {
    return new DropdownMaintenanceFormGroup(this.ctrlService, this.itemData().action, data, );
  }

  override getConfig(): MaintenanceConfig<DropdownMaintenanceFormGroup, DropdownDto> {
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
  
  OnToggleNewCategory() {
    this.isNewCategory.set(this.form.isNewCategoryFC.value);
    // this.form.categoryDDFC.setOptionItem(RSLabelDropdownFormControlOptions.required, !this.isNewCategory());
    // this.form.categoryTextFC.setOptionItem(RSLabelTextFormControlOptions.required, this.isNewCategory());
  }
}
