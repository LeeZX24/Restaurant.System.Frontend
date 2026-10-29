import { inject, Service } from '@angular/core';
import { RSComboboxFormControl } from '../controls/custom-combobox-form-control/custom-combobox-form-control';
import { RSLabelDropdownFormControl, RSLabelDropdownFormControlOptions } from '../controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control';
import { DropdownService } from '../../core/services/api/dropdown.service';
import { DropdownModel } from '../models/dropdown.model';
import { RSLabelTextFormControl, RSTextFormControl } from '@LeeZX24/forms';
import { ValidatorFn, Validators } from '@angular/forms';

@Service()
export class ControlService {
  private ddService= inject(DropdownService);

  ComboboxFormControl(required: boolean, value: unknown, data?: DropdownModel[]) {
    return new RSComboboxFormControl(
      { required: required, titleField: 'value', valueField: 'key', items: data },
      value,
    );
  }

  LabelDropdownControl(label: string, required: boolean, value: string, data?: DropdownModel[]) {
    return new RSLabelDropdownFormControl(
      label,
      { required: required, dropdownTitleField: 'value', dropdownValueField: 'key', dropdownData: data },
      value,
    );
  }

  LabelDropdownControlDropdown(label: string, required: boolean, value: string) {
    const fc = this.LabelDropdownControl(label, required, value, undefined);

    this.ddService.getCategoryList().subscribe(response => {
      fc.setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, response);
      fc.updateValueAndValidity();
    })

    return fc;
  }

  LabelDropdownControlDropdownbyCategory(label: string, required: boolean, category: string, value: string) {
    const fc = this.LabelDropdownControl(label, required, value, undefined);

    this.ddService.getDropdownListByCategory(category).subscribe((ddList) => {
      fc.setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, ddList);
      fc.updateValueAndValidity();
    });

    return fc;
  }

  LabelDropdownControlDropdownbyCategoryTags(label: string, required: boolean, category: string, tags: string, value: string) {
    const fc = this.LabelDropdownControl(label, required, value, undefined);

    this.ddService.getDropdownListByCategoryTags(category, tags).subscribe((ddList) => {
      fc.setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, ddList);
      fc.updateValueAndValidity();
    });

    return fc;
  }

  LabelText(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number, mask?: string, autocomplete?: string }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.minLength(options.maxLength));
    }

    const fc = new RSLabelTextFormControl(label, {
      required: required,
      minlength: options && options.minLength ? options.minLength: undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      mask: options && options.mask ? options.mask : undefined,
      inputType: 'text',
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }

  NonLabelText(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number, mask?: string, autocomplete?: string }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.minLength(options.maxLength));
    }

    const fc = new RSTextFormControl({
      required: required,
      minlength: options && options.minLength ? options.minLength: undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      mask: options && options.mask ? options.mask : undefined,
      inputType: 'text',
      placeholder: label
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }

  LabelEmail(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.maxLength(options.maxLength));
    }

    validators.push(Validators.email);

    const fc = new RSLabelTextFormControl(label, {
      required: required,
      minlength: options && options.minLength ? options.minLength : undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      inputType: 'email',
      autoComplete: 'email'
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }

  NonLabelEmail(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.minLength(options.maxLength));
    }

    validators.push(Validators.email);

    const fc = new RSTextFormControl({
      required: required,
      minlength: options && options.minLength ? options.minLength : undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      inputType: 'email',
      autoComplete: 'email',
      placeholder: label
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }

  LabelNumberText(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number }) {
    return this.LabelText(label, required, value, {
      minLength: options && options.minLength ? options.minLength : undefined,
      maxLength: options && options.minLength ? options.minLength: undefined,
      mask: '0*'
    });
  }

  NonLabelNumberText(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number }) {
    return this.NonLabelText(label, required, value, {
      minLength: options && options.minLength ? options.minLength : undefined,
      maxLength: options && options.minLength ? options.minLength: undefined,
      mask: '0*'
    });
  }

  LabelPassword(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number, mask?: string, isNewPassword?: boolean }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.minLength(options.maxLength));
    }

    const fc = new RSLabelTextFormControl(label, {
      required: required,
      minlength: options && options.minLength ? options.minLength: undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      mask: options && options.mask ? options.mask : undefined,
      inputType: 'password',
      autoComplete: options && options.isNewPassword ? 'new-password' : 'currentPassword'
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }

  NonLabelPassword(label: string, required: boolean, value: string, options?: { minLength?: number, maxLength?: number, mask?: string, isNewPassword?: boolean }) {
    const validators: ValidatorFn[] = [];

    if(required) validators.push(Validators.required);

    if(options) {
      if(options.minLength) validators.push(Validators.minLength(options.minLength));
      if(options.maxLength) validators.push(Validators.minLength(options.maxLength));
    }

    const fc = new RSTextFormControl({
      required: required,
      minlength: options && options.minLength ? options.minLength: undefined,
      maxlength: options && options.maxLength ? options.maxLength : undefined,
      mask: options && options.mask ? options.mask : undefined,
      inputType: 'password',
      placeholder: label,
      autoComplete: options && options.isNewPassword ? 'new-password' : 'currentPassword'
     }, value);
    fc.setCustomValidators(validators);

    return fc;
  }
}
