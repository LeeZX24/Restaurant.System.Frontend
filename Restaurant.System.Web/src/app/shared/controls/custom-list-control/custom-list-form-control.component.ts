import { CommonModule } from '@angular/common';
import { Component, input, signal, OnDestroy, model, effect, untracked } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomButtonControl } from '../custom-button-control/custom-button-control';
import { RSTextFormControl, RSTextFormControlComponent } from '@LeeZX24/forms';
import { RSComboboxFormControlComponent } from '../custom-combobox-form-control/custom-combobox-form-control.component';
import { RSComboboxFormControl } from '../custom-combobox-form-control/custom-combobox-form-control';
import { RSListOptions } from './custom-list-form-control';
import { CastPipe } from '../cast.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rs-list-control',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomButtonControl,
    RSComboboxFormControlComponent,
    RSTextFormControlComponent,
    CastPipe,
  ],
  templateUrl: './custom-list-form-control.component.html',
  styleUrl: './custom-list-form-control.component.css',
})
export class CustomListFormControlComponent<TItem extends object> implements OnDestroy  {
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');
  fc = model<FormControl<TItem[]>>();
  label = input<string>('');
  options = input.required<RSListOptions<TItem>>();

  rows = signal<TItem[]>([]);

  private fgCache = new WeakMap<TItem, FormGroup>();
  private rowSubscriptions = new Map<TItem, Subscription>();

  private readonly syncEffect = effect(() => {
    const control = this.fc();
    untracked(() => this.syncControls(control));
  });

  readonly CustomControlType = {
    Combobox: null as unknown as RSComboboxFormControl,
    Textbox: null as unknown as RSTextFormControl,
  };

  isComboboxFormControl(control: AbstractControl) {
    return control instanceof RSComboboxFormControl;
  }

  isTextboxFormControl(control: AbstractControl) {
    return control instanceof RSTextFormControl;
  }

  getRowFG(row: TItem): FormGroup {
    this.initializeRow(row);
    return this.fgCache.get(row) ?? new FormGroup({});
  }

  onAddClick() {
    const newRow = this.options()?.createEmptyRow?.() ?? ({} as TItem);

    this.initializeRow(newRow)
    this.rows.update((rows) => [...rows, newRow]);
    this.syncListValue();
  }

  removeListItem(index: number) {
    const row = this.rows()[index];

    if (row) {
      this.rowSubscriptions.get(row)?.unsubscribe();
      this.rowSubscriptions.delete(row);
      this.fgCache.delete(row);
    }

    this.rows.update((rows) => rows.filter((_, i) => i !== index));
    this.syncListValue();
  }

  private syncControls(control?: FormControl<TItem[]>): void {
    if (!control) {
      this.rows.set([]);
      return;
    }

    const items = control.value ?? [];

    this.rows.set([...items]);

    items.forEach(item => this.initializeRow(item));
  }

  private initializeRow(row: TItem) {
    if(this.fgCache.has(row)) return;
    const fg = this.options()?.createFormGroup?.(row) ?? new FormGroup({});
    fg.patchValue(row);
    this.fgCache.set(row, fg);

    const subscription = fg.valueChanges.subscribe(() => {
      this.syncListValue();
    });

    this.rowSubscriptions.set(row, subscription);
  }

  private syncListValue(): void {
    const values = this.rows().map(row => ({
      ...row,
      ...this.getRowFG(row).getRawValue(),
    })) as TItem[];

    this.fc()?.setValue(values);
  }

  ngOnDestroy(): void {
    this.rowSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.rowSubscriptions.clear();
  }
}
