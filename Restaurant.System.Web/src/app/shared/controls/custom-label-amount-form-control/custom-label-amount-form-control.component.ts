import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import { RSLabelFormControlBaseComponent } from '@LeeZX24/forms';
import { RSLabelAmountFormControl } from './custom-label-amount-form-control';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent, NgxMaskDirective],
  selector: 'rs-label-amount-form-control',
  styleUrl: './custom-label-amount-form-control.component.css',
  templateUrl: './custom-label-amount-form-control.component.html',
})
export class RSLabelAmountFormControlComponent implements OnInit {
  fc = input.required<RSLabelAmountFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');

  private readonly _input = viewChild.required<ElementRef>('input');

  ngOnInit() {
    const fc = this.fc();
    if (!fc?.setValue) return;
  }

  focus(): void {
    this._input().nativeElement.focus();
  }

  onChangeAmount(event: InputEvent) {
    const fc = this.fc();
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.value || inputElement.value.trim() === '') {
      fc.setValue(Number(0).toFixed(2));
    }
  }

  onBlurAmount() {
    this.fc().markAsTouched();
  }

  readonly amountOutputTransform = (
    value: string | number | null | undefined,
  ): number | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const amount = Number(String(value).replace(/,/g, ''));

    return Number.isFinite(amount) ? amount : null;
  };
}
