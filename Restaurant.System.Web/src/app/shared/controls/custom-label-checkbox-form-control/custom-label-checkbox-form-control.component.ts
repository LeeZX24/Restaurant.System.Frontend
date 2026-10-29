import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RSLabelCheckboxFormControl } from './custom-label-checkbox-form-control';
import { RSLabelFormControlBaseComponent } from "@LeeZX24/forms";

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent],
  selector: 'rs-label-checkbox-form-control',
  styleUrl: './custom-label-checkbox-form-control.component.css',
  templateUrl: './custom-label-checkbox-form-control.component.html',
})
export class RSLabelCheckboxFormControlComponent {
  fc = input.required<RSLabelCheckboxFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('');
  checkChange = output<boolean>();

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checkChange.emit(target.checked);
  }
}
