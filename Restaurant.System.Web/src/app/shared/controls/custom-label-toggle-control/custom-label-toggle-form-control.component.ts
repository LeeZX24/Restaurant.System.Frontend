import { Component, computed, input, output, signal } from '@angular/core';
import { RSLabelFormControlBaseComponent } from '@LeeZX24/forms';
import { RSLabelToggleFormControl } from './custom-label-toggle-form-control';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent, MatIconModule],
  selector: 'rs-label-toggle-form-control',
  styleUrl: './custom-label-toggle-form-control.component.css',
  templateUrl: './custom-label-toggle-form-control.component.html',
})
export class CustomLabelToggleFormControl {
  fc = input.required<RSLabelToggleFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  isCheck = signal(false);

  // eslint-disable-next-line @angular-eslint/no-output-native
  change = output<boolean>();


  currentToggleView = computed(() => {
    const toggle = this.fc().toggle;

    return this.isCheck()
      ? toggle?.toggleOn
      : toggle?.toggleOff;
  });

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isCheck.set(target.checked);
    this.change.emit(target.checked);
  }
}
