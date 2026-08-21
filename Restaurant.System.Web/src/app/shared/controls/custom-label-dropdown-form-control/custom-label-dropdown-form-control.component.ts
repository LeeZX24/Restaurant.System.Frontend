import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RSLabelFormControlBaseComponent } from '@LeeZX24/forms';
import { RSLabelDropdownFormControl, RSLabelDropdownFormControlOptions } from './custom-label-dropdown-form-control';

@Component({
  selector: 'rs-label-dropdown-form-control',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent ],
  templateUrl: './custom-label-dropdown-form-control.component.html',
  styleUrl: './custom-label-dropdown-form-control.component.css',
})
export class RSLabelDropdownFormControlComponent<TData = unknown, TValue = string> {
  fc = input.required<RSLabelDropdownFormControl<TData, TValue>>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');
  items = input<TData[]>([]);

  @ViewChild('input') private _input!: ElementRef;

  constructor() {
    effect(() => {
      this.fc().setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, this.items());
    });
  }

  focus(): void {
    this._input.nativeElement.focus();
  }
}
