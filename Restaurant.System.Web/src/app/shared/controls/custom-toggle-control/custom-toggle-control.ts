import { NgClass } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CustomToggle } from './custom-toggle';

@Component({
  selector: 'rs-toggle',
  imports: [MatIconModule, NgClass],
  templateUrl: './custom-toggle-control.html',
  styleUrl: './custom-toggle-control.css',
})
export class CustomToggleControl {
  toggle = input<CustomToggle>();
  isCheck = model(false);

  toggleChecked = output<void>();

  toggleOffHaveIcon = computed(() => !!this.toggle()?.toggleOff?.icon );
  toggleOnHaveIcon = computed(() => !!this.toggle()?.toggleOn?.icon );

  toggleCheckbox() {
    this.isCheck.update(c => !c);
    this.toggleChecked.emit();
  }


}
