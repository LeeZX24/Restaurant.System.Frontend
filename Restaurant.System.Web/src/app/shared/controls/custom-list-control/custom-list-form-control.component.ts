import { CommonModule } from '@angular/common';
import { Component, computed, input, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomButtonControl } from "../custom-button-control/custom-button-control";
import { DropDownModel } from '../custom-label-dropdown-form-control/dropdown';
import { CustomFormGroup } from '@rs/forms';
import { RSDropdownFormControl } from '../custom-dropdown-form-control/custom-dropdown-form-control';
import { CustomComboboxFormControlComponent } from "../custom-combobox-form-control/custom-combobox-form-control.component";
import { RSComboboxFormControl } from '../custom-combobox-form-control/custom-combobox-form-control';

@Component({
  selector: 'rs-list-control',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomButtonControl, CustomComboboxFormControlComponent],
  templateUrl: './custom-list-form-control.component.html',
  styleUrl: './custom-list-form-control.component.css',
})
export class CustomListFormControlComponent implements OnInit{
  labelSize = input<string>();
  inputSize = input<string>();
  formList = model<CustomFormGroup[]>([]);

  form = signal<CustomFormGroup>(this.createForm());

  items = input<DropDownModel[]>([{'key': 'gray', 'value': 'Gray'}, {'key': 'pink', 'value': 'Pink'}]);

  private rowNumber = 0;

  isCombobox = computed(() => this.getFormControl('combobox') instanceof RSComboboxFormControl);

  ngOnInit(): void {
    if(this.formList().length === 0) this.addListItem();
  }

  createForm(): CustomFormGroup {
    const fg = new CustomFormGroup();

    // this.list().forEach((formGroup, index) => {

    // });

    // fg._addCustomControl(
    //   'dropdown',
    //   new RSLabelDropdownFormControl('Drop Down', { titleField: 'value', valueField: 'key', required: true }, undefined, [
    //     Validators.required,
    //   ]),
    // );

    // fg._addCustomControl(
    //   'dropdown',
    //   new RSDropdownFormControl({ titleField: 'value', valueField: 'key', required: true }, undefined, [
    //     Validators.required,
    //   ]),
    // );

    fg._addCustomControl(
      `combobox`,
      new RSComboboxFormControl({ titleField: 'value', valueField: 'key', required: true }, '', [
        Validators.required,
      ])
    );
    return fg;
  }

  // get dropdownFC() { return this.getFormControl('dropdown') as RSLabelDropdownFormControl<DropDownModel, string>; }

  dropdownFC = computed(() => this.getFormControl('dropdown') as RSDropdownFormControl<DropDownModel, string>);

  comboboxFC = computed(() => this.getFormControl(`combobox`) as RSComboboxFormControl<DropDownModel, string>);

  getFormControl(name: string) {
    return this.form().get(name);
  }

  addListItem() {
    const newForm = this.createForm();
    this.formList.update(currentList => [...currentList, newForm]);
  }

  removeListItem(index: number) {
    this.formList.update(currentList => currentList.filter((_, i) => i !== index));
  }
}
