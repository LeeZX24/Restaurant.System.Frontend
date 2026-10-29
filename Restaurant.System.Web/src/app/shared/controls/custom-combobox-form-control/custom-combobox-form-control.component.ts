import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RSComboboxFormControl } from './custom-combobox-form-control';
import { CustomFormControlBaseComponent } from '@LeeZX24/forms';
import { DropdownModel } from '../../models/dropdown.model';
import { ComboboxItem } from './combobox';

@Component({
  selector: 'rs-combobox-form-control',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, CustomFormControlBaseComponent],
  templateUrl: './custom-combobox-form-control.component.html',
  styleUrl: './custom-combobox-form-control.component.css',
})
export class RSComboboxFormControlComponent {
  fc = input.required<RSComboboxFormControl>();
  inputSize = input<string>('w-full');
  items = input<DropdownModel[]>([]);
  isOpen = signal(false);

  term = signal('');
  valueChange = output<string>();

  readonly selectedItem = signal<ComboboxItem<DropdownModel> | null>(null);

  @ViewChild('input') private _input!: ElementRef;

  isSelected = computed(() => {
    return this.selectedItem() ? true : false;
  });

  focus(): void {
    this._input.nativeElement.focus();
    this.isOpen.update((open) => !open);
  }

  onInputChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    this.fc().searchTerm$.set(event.target.value);
  }

  onItemSelected(item: ComboboxItem<DropdownModel>) {
    const selectedItem = item;
    if(!selectedItem) return;
    this.selectedItem.set(selectedItem);

    this.fc().setValue(selectedItem);

    const title = selectedItem.title;
    if(!title) return;
    this.fc().searchTerm$.set(title);


    this.isOpen.set(false);
  }

  clearSelected() {
    this.selectedItem.set(null);
    this.fc().clear();
  }
}
