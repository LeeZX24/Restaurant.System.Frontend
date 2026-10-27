import { Component, input, output } from '@angular/core';
import { RSCheckboxFormControl } from './custom-checkbox-form-control';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormControlBaseComponent } from '@LeeZX24/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomFormControlBaseComponent],
  selector: 'rs-checkbox-form-control',
  styleUrl: './custom-checkbox-form-control.component.css',
  templateUrl: './custom-checkbox-form-control.component.html',
})
export class CustomCheckboxFormControlComponent {
  fc = input.required<RSCheckboxFormControl>();
  checkChange = output<boolean>();

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checkChange.emit(target.checked);
  }
}
