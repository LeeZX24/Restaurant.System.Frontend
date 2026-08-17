import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RSDropdownFormControl, RSDropdownFormControlOptions } from './custom-dropdown-form-control';

@Component({
  selector: 'rs-dropdown-form-control',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './custom-dropdown-form-control.component.html',
  styleUrl: './custom-dropdown-form-control.component.css',
})
export class RSDropdownFormControlComponent<TData extends Record<string, unknown>, TValue = unknown> {
  fc = input.required<RSDropdownFormControl<TData, TValue>>();
  inputSize = input<string>('w-8/12');
  items = input<TData[]>([]);

  @ViewChild('input') private _input!: ElementRef;

  constructor() {
    effect(() => {
      this.fc().setOptionItem(RSDropdownFormControlOptions.items, this.items());
    });
  }

  focus(): void {
    this._input.nativeElement.focus();
  }

  public funcTrackBy(index: number, item: KeyValue<string, string>) {
    return item.value;
  }
}
