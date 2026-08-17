import { Service } from '@angular/core';
import { RSComboboxFormControl } from '../controls/custom-combobox-form-control/custom-combobox-form-control';
import { DropdownDto } from '../controls/custom-dropdown-form-control/dropdown';
import { RSLabelDropdownFormControl } from '../controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control';

@Service()
export class ControlService {
  ComboboxFormControl(required: boolean, value: unknown, data?: DropdownDto[]) {
    return new RSComboboxFormControl<DropdownDto, string>(
      { required: required, titleField: 'value', valueField: 'key', items: data },
      value,
    );
  }

  LabelDropdownControl(label: string, required: boolean, value: unknown, data?: DropdownDto[]) {
    return new RSLabelDropdownFormControl<DropdownDto, string>(
      label,
      { required: required, titleField: 'value', valueField: 'key', items: data },
      value,
    );
  }
}
