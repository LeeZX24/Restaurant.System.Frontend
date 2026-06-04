import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RSLabelFormControlBaseComponent } from '@rs/forms';
import { RSLabelDropdownFormControl, RSLabelDropdownFormControlOptions } from './custom-label-dropdown-form-control';

@Component({
  selector: 'rs-label-dropdown-form-control',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent ],
  templateUrl: './custom-label-dropdown-form-control.component.html',
  styleUrl: './custom-label-dropdown-form-control.component.css',
})
export class RSLabelDropdownFormControlComponent<TData extends Record<string, unknown>, TValue = unknown> {
  fc = input.required<RSLabelDropdownFormControl<TData, TValue>>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');
  items = input<TData[]>([]);

  @ViewChild('input') private _input!: ElementRef;

  constructor() {
    effect(() => {
      this.fc().setOptionItem(RSLabelDropdownFormControlOptions.items, this.items());
    });
  }

  focus(): void {
    this._input.nativeElement.focus();
  }

  public funcTrackBy(index: number, item: KeyValue<string, string>) {
    return item.value;
  }
}
