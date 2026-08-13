import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { provideNgxMask } from 'ngx-mask';
import { RSComboboxFormControl } from './custom-combobox-form-control';
import { DropDownItem } from '../custom-label-dropdown-form-control/dropdown';

@Component({
  selector: 'rs-combobox-form-control',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './custom-combobox-form-control.component.html',
  styleUrl: './custom-combobox-form-control.component.css',
  providers: [provideNgxMask()],
})
export class CustomComboboxFormControlComponent<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  fc = input.required<RSComboboxFormControl<TData, TValue>>();
  items = input<TData[]>([]);
  isOpen = signal(false);

  term = signal('');
  valueChange = output<string>();

  @ViewChild('input') private _input!: ElementRef;

  isSelected = computed(() => {
    return this.fc().selectedData() ? true : false;
  });

  focus(): void {
    this._input.nativeElement.focus();
    this.isOpen.update((open) => !open);
  }

  onInputChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    this.fc().searchTerm$.set(event.target.value);
  }

  onItemSelected(item: DropDownItem<TValue>) {
    this.fc().setValue(item.value, { emitEvent: false });
    this.fc().searchTerm$.set(item.title);
    this.isOpen.set(false);
  }
}
