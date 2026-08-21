import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DropdownMaintenanceFormGroup } from './dropdown-maintenance-form';
import { MaintenanceConfig } from '../../maintenance.entity';
import { DropdownDto } from '../../../shared/models/dtos/dropdown.dto';
import { ControlService } from '../../../shared/services/control.service';
import { MaintenanceFormComponent } from '../form.component';
import { CustomButtonControl } from "../../../shared/controls/custom-button-control/custom-button-control";
import { CustomToggleControl } from "../../../shared/controls/custom-toggle-control/custom-toggle-control";
import { RSLabelTextFormControlComponent, RSLabelTextFormControlOptions } from "@LeeZX24/forms";
import { RSLabelDropdownFormControlComponent } from "../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control.component";
import { provideNgxMask } from 'ngx-mask';
import { CustomToggle } from '../../../shared/controls/custom-toggle-control/custom-toggle';
import { RSLabelDropdownFormControlOptions } from '../../../shared/controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control';

@Component({
  selector: 'rs-dropdown-maintenance-form',
  template: `
    <div class="form-container">
      <div class="form-content">
        @if(this.itemData().action === 'create') {
          <div class="flex flex-row items-center">
            <span class="form-label w-4/12">Create new category ?</span>
            <rs-toggle [toggle]="newCategory()" (toggleChecked)="OnToggleNewCategory()"></rs-toggle>
          </div>
          <div>
            @if(!isNewCategory()) { <rs-label-dropdown-form-control [fc]="form.categoryDDFC"></rs-label-dropdown-form-control> }
            @if(isNewCategory()) { <rs-label-text-form-control [fc]="form.categoryTextFC"></rs-label-text-form-control> }

            <rs-label-text-form-control [fc]="form.codeFC"></rs-label-text-form-control>
            <rs-label-text-form-control [fc]="form.descriptionFC"></rs-label-text-form-control>
            <rs-label-text-form-control [fc]="form.seqNoFC"></rs-label-text-form-control>
          </div>
        }
        @else {
          <rs-label-text-form-control [fc]="form.categoryTextFC"></rs-label-text-form-control>

          <rs-label-text-form-control [fc]="form.codeFC"></rs-label-text-form-control>
          <rs-label-text-form-control [fc]="form.descriptionFC"></rs-label-text-form-control>
          <rs-label-text-form-control [fc]="form.seqNoFC"></rs-label-text-form-control>
        }

      </div>

      <div class="form-actions">
        <rs-button-control [cssClass]="'btn-primary'" [label]="this.itemData().action === 'create' ? 'Create' : 'Update'" (buttonClicked)="processSubmit()"></rs-button-control>
        <rs-button-control [cssClass]="'btn-secondary'"[label]="'Close'"  (buttonClicked)="close()"></rs-button-control>
      </div>
  </div>
  `,
  imports: [CustomButtonControl, RSLabelTextFormControlComponent, RSLabelDropdownFormControlComponent, CustomToggleControl],
  providers: [provideNgxMask()]
})
export class DropdownMaintenanceFormComponent extends MaintenanceFormComponent<DropdownMaintenanceFormGroup, DropdownDto> implements OnInit, AfterViewInit {

  protected ctrlService = inject(ControlService);

  newCategory = computed<CustomToggle>(() => {
    return {
      toggleOff: {
        label: 'OFF',
      },
      toggleOn: {
        label: 'ON',
      },
      disabled: false,
    };
  });

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

  ngAfterViewInit(): void {
    // console.log(this.form.categoryDDFC);
  }

  override ValidateForm(): boolean {
    this.form.markAllAsTouched();
    if(this.form.invalid) {

      return false;
    }
    return true;
  }

  OnToggleNewCategory() {
    this.isNewCategory.update(nc => !nc);

    this.form.categoryDDFC.setOptionItem(RSLabelDropdownFormControlOptions.required, this.isNewCategory() ? false: true);
    this.form.categoryTextFC.setOptionItem(RSLabelTextFormControlOptions.required, this.isNewCategory() ? true: false);

    this.form.categoryDDFC.updateValueAndValidity();
    this.form.categoryTextFC.updateValueAndValidity();
  }
}
