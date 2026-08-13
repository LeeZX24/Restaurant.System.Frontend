import { Service } from '@angular/core';
import { RSComboboxFormControl } from '../controls/custom-combobox-form-control/custom-combobox-form-control';
import { DropDownModel } from '../controls/custom-dropdown-form-control/dropdown';

@Service()
export class ControlService {
  ComboboxFormControl(required: boolean, value: unknown, data?: DropDownModel[]) {
    return new RSComboboxFormControl<DropDownModel, string>(
      { required: required, titleField: 'value', valueField: 'key', items: data },
      value,
    );
  }
}
