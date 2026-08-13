import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomButtonControl } from '../custom-button-control/custom-button-control';
import { DropDownModel } from '../custom-label-dropdown-form-control/dropdown';
import { RSTextFormControl, RSTextFormControlComponent } from '@rs/forms';
import { CustomComboboxFormControlComponent } from '../custom-combobox-form-control/custom-combobox-form-control.component';
import { RSComboboxFormControl } from '../custom-combobox-form-control/custom-combobox-form-control';
import { CustomListOptions } from './custom-list-form-control';
import { provideNgxMask } from 'ngx-mask';
import { CastPipe } from '../cast.pipe';
@Component({
  selector: 'rs-list-control',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomButtonControl,
    CustomComboboxFormControlComponent,
    RSTextFormControlComponent,
    CastPipe,
  ],
  templateUrl: './custom-list-form-control.component.html',
  styleUrl: './custom-list-form-control.component.css',
  providers: [provideNgxMask()],
})
export class CustomListFormControlComponent<TItem extends object> {
  labelSize = input<string>();
  inputSize = input<string>();
  fc = input<FormControl>();
  options = input.required<CustomListOptions<TItem>>();

  rows = signal<TItem[]>([]);

  private fgCache = new WeakMap<TItem, FormGroup>();

  readonly CustomControlType = {
    Combobox: null as unknown as RSComboboxFormControl<DropDownModel, string>,
    Textbox: null as unknown as RSTextFormControl,
  };

  isComboboxFormControl(control: AbstractControl) {
    return control instanceof RSComboboxFormControl;
  }

  isTextboxFormControl(control: AbstractControl) {
    return control instanceof RSTextFormControl;
  }

  getRowFG(row: TItem): FormGroup {
    if (!row) return new FormGroup({});

    if (this.fgCache.has(row)) {
      const fg = this.fgCache.get(row)!;
      return fg;
    }

    const fg = this.options()?.createFormGroup?.(row) ?? new FormGroup({});
    fg.patchValue(row);
    this.fgCache.set(row, fg);
    return fg;
  }

  onAddClick() {
    const newRow = this.options()?.createEmptyRow?.() ?? ({} as TItem);
    const fg = this.getRowFG(newRow);
    this.rows.update((rows) => [...rows, newRow]);

    console.log(fg.get('type')?.value);
    console.log((fg.get('type') as RSComboboxFormControl<DropDownModel, string>).searchTerm$());
  }

  removeListItem(index: number) {
    this.rows.update((rows) => rows.filter((_, i) => i !== index));
  }
}
