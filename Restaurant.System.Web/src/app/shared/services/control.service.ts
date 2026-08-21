import { RSLabelDropdownFormControlOptions } from './../controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control';
import { inject, Service } from '@angular/core';
import { RSComboboxFormControl } from '../controls/custom-combobox-form-control/custom-combobox-form-control';
import { RSLabelDropdownFormControl } from '../controls/custom-label-dropdown-form-control/custom-label-dropdown-form-control';
import { DropdownService } from '../../core/services/api/dropdown.service';
import { DropdownModel } from '../models/dropdown.model';

@Service()
export class ControlService {
  private ddService= inject(DropdownService);

  ComboboxFormControl(required: boolean, value: unknown, data?: DropdownModel[]) {
    return new RSComboboxFormControl<DropdownModel, string>(
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
    console.log('[Dropdown Control] creating:', label);

    const fc = this.LabelDropdownControl(label, required, value, undefined);

    this.ddService.getCategoryList().subscribe(response => {
      console.log('[Dropdown Control] set options:', response);

      fc.setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, response);
      fc.updateValueAndValidity();
    })

    return fc;
  }

  LabelDropdownControlDropdownbyCategory(label: string, required: boolean, category: string, value: string) {
    let dropdownList: DropdownModel[] = [];

    this.ddService.getDropdownList().subscribe((ddList) => {
      dropdownList = [...ddList];
    });
    return this.LabelDropdownControl(label, required, value, dropdownList);
  }

  LabelDropdownControlDropdownbyCategoryTags(label: string, required: boolean, category: string, tags: string, value: string) {
    let dropdownList: DropdownModel[] = [];

    this.ddService.getDropdownList().subscribe((ddList) => {
      dropdownList = [...ddList];
    });
    return this.LabelDropdownControl(label, required, value, dropdownList);
  }
}
