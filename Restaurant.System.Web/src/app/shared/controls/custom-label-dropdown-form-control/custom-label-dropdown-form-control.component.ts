import { Component, ElementRef, input, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RSLabelFormControlBaseComponent } from '@LeeZX24/forms';
import { RSLabelDropdownFormControl, RSLabelDropdownFormControlOptions } from './custom-label-dropdown-form-control';
import { DropdownModel } from '../../models/dropdown.model';

@Component({
  selector: 'rs-label-dropdown-form-control',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, RSLabelFormControlBaseComponent ],
  templateUrl: './custom-label-dropdown-form-control.component.html',
  styleUrl: './custom-label-dropdown-form-control.component.css',
})
export class RSLabelDropdownFormControlComponent implements OnInit {
  fc = input.required<RSLabelDropdownFormControl>();
  labelSize = input<string>('w-4/12');
  inputSize = input<string>('w-8/12');
  items = input<DropdownModel[]>([]);

  private readonly _input = viewChild.required<ElementRef>('input');

  ngOnInit(): void {
    if(this.items().length) this.fc().setOptionItem(RSLabelDropdownFormControlOptions.dropdownData, this.items());
  }

  focus(): void {
    this._input().nativeElement.focus();
  }
}
