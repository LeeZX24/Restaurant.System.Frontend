import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { provideNgxMask } from 'ngx-mask';
import { RSComboboxFormControl, RSComboboxFormControlOptions } from './custom-combobox-form-control';
import { DropDownItem } from '../custom-label-dropdown-form-control/dropdown';

@Component({
  selector: 'rs-combobox-form-control',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './custom-combobox-form-control.component.html',
  styleUrl: './custom-combobox-form-control.component.css',
  providers: [provideNgxMask()]
})
export class CustomComboboxFormControlComponent<TData extends Record<string, unknown>, TValue = unknown> {
  fc = input.required<RSComboboxFormControl<TData,TValue>>();
  items = input<TData[]>([]);
  isOpen = signal(false);

  term = signal('');
  valueChange = output<string>();

  @ViewChild('input') private _input!: ElementRef;

  isSelected = computed(() => {
    return this.fc().selectedData() ? true: false;
  });

  constructor() {
    effect(() => {
      this.fc().setOptionItem(RSComboboxFormControlOptions.items, this.items());
    });
  }

  focus(): void {
    this._input.nativeElement.focus();
    this.isOpen.update(open => !open);
  }

  onInputChange(text: string) {
    this.term.set(text);
    this.valueChange.emit(text);
  }

  onItemSelected(item: DropDownItem<TValue>) {
    if(this.fc().selectedData()) {
      if(this.fc().selectedTitle() !== item.title) {
        this.fc().setValue(item.value, { emitEvent: false });
      }
    }

    this.fc().searchTerm$.set(item.title);
  }
}
