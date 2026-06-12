import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { CustomToggleControl } from "../../../shared/controls/custom-toggle-control/custom-toggle-control";
import { CustomToggle } from '../../../shared/controls/custom-toggle-control/custom-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomListFormControlComponent } from '../../../shared/controls/custom-list-control/custom-list-form-control.component';
import { form, FormField, required, validate } from "@angular/forms/signals";
import { CustomButtonControl } from "../../../shared/controls/custom-button-control/custom-button-control";
import { ApiConfiguration } from './api-configuration/api-configuration';
import { CheckboxFormControlComponent } from "../../../shared/controls/signal-forms/checkbox-form-control.component/checkbox-form-control.component";
import { CheckboxFormControl } from '../../../shared/controls/signal-forms/signal-form-control';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomToggleControl, CustomListFormControlComponent, CustomButtonControl, FormField, CheckboxFormControlComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  providers: []
})
export class SettingsComponent  {
  dialog = inject(MatDialog);
  // testingConfig = signal<TextFormControl>({ key: 'testing', label: 'Testing', type: 'text', options: { required: true, inputType: 'text', placeholder: 'Testing...', autoComplete: '', minlength: 2, maxlength: 5}});
  // testing2Config = signal<DropdownFormControl<DropDownModel, string>>({ key: 'testing 2', label: 'Testing 2', type: 'dropdown', options: { required: true, titleField: 'value', valueField: 'key' }});
  // testing3Config = signal<ComboboxFormControl<ComboboxModel, string>>({ key: 'testing 3', label: 'Testing 3', type: 'dropdown', options: { required: true, titleField: 'value', valueField: 'key' }});
  // testing4Config = signal<TextFormControl>({ key: 'testing4', label: 'Testing 4', type: 'date', options: { required: true, inputType: 'date', placeholder: 'Testing 4...', autoComplete: '', minlength: 2, maxlength: 5}});
  // testing5Config = signal<RadioGroupFormControl<RadioGroupModel>>({ key: 'testing5', label: 'Testing 5', type: 'radio', options: { required: true, titleField:'value', valueField:'key', radioData: [{'key': 'free', 'value': 'Free'}, {'key': 'premium', 'value': 'Premium'}] }});
  // testing6Config = signal<TextareaFormControl>({ key: 'testing6', label: 'Testing 6', type: 'text', options: { required: true, placeholder: 'Testing...', rows: 4, cols: 15}});

  testingConfig = signal<CheckboxFormControl>({ key: 'testing', label: 'Testing', type: 'checkbox', options: { required: true }});

  settingsModel = signal({
    testing: false
    // testing: '',
    // testing2: { value: '-1' } as DropDownItem<string>,
    // testing3: { value: '' } as ComboboxItem<string>,
    // testing4: '',
    // testing5: { value: '' } as RadioGroupItem<string>,
    // testing6: ''
  });

  settingsForm = form(this.settingsModel, (schema) => {
    //#region  Testing
    // const minlength1 = cfg1.minlength;
    // const maxlength1 = cfg1.maxlength;
    const cfg1 = this.testingConfig().options;
    if(cfg1.required) required(schema.testing);

    validate(schema.testing, (ctx)=> {
      console.log(ctx);
      const value = ctx.value();
      return (!!ctx && (value === false) ? { kind: 'required' }: null);
    });
    // if(minlength1 != null) minLength(schema.testing, minlength1);
    // if(maxlength1 != null) maxLength(schema.testing, maxlength1);
    //#endregion

    // //#region Testing 2
    // const cfg2 = this.testing2Config().options;
    // if(cfg2.required) required(schema.testing2);
    // validate(schema.testing2, (ctx)=> {
    //   const value = ctx.value();
    //   return (!!ctx && (value.value === '-1') ? {kind: 'required'}: null);
    // });
    // //#endregion

    // //#region Testing 3
    // const cfg3 = this.testing3Config().options;
    // if(cfg3.required) required(schema.testing3);
    // validate(schema.testing3, (ctx)=> {
    //   const value = ctx.value();
    //   console.log(value);
    //   return (!!ctx && value && (value.value == '') ? {kind: 'required'}: null);
    // });
    // //#endregion

    // //#region  Testing 4
    // const cfg4 = this.testing4Config().options;

    // if(cfg4.required) required(schema.testing4);
    // //#endregion

    // //#region  Testing 5
    // const cfg5 = this.testing4Config().options;

    // if(cfg5.required) required(schema.testing5);
    // //#endregion

    // //#region  Testing 6
    // const cfg6 = this.testing6Config().options;

    // if(cfg6.required) required(schema.testing6);
    // //#endregion
  });

  // ngOnInit(): void {
  //   // const dropDownItems: DropDownModel[] = [{'key': 'gray', 'value': 'Gray'}, {'key': 'pink', 'value': 'Pink'}]
  //   // this.testing2Config().options.dropdownItems = [...dropDownItems];

  //   // const comboboxItems: ComboboxModel[] = [{'key': 'gray', 'value': 'Gray'}, {'key': 'pink', 'value': 'Pink'}]
  //   // this.testing3Config().options.comboboxItems = [...comboboxItems];
  //   super(this.ngOnInit());
  // }

  // getFormControl(name: string) {
  //   return this.form.get(name);
  // }

  themeService = inject(ThemeService);

  darkMode = computed<CustomToggle>(() => {
    return {
      toggleOff: {
        icon: 'light_mode',
        label: 'OFF'
      },
      toggleOn: {
        icon: 'dark_mode',
        label: 'ON'
      },
      disabled: false
    }
  });

  OnAPIConfigOpen() {
    this.dialog.open(ApiConfiguration, {
      width: 'min(900px, 95vw)',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'rs-dialog-form',
    });
  }
}
