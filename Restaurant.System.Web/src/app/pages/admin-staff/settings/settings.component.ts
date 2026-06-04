import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { CustomToggleControl } from "../../../shared/controls/custom-toggle-control/custom-toggle-control";
import { CustomToggle } from '../../../shared/controls/custom-toggle-control/custom-toggle';
import { CustomFormGroup } from '@rs/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomListFormControlComponent } from '../../../shared/controls/custom-list-control/custom-list-form-control.component';
@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomToggleControl, CustomListFormControlComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  form!: CustomFormGroup;

  getFormControl(name: string) {
    return this.form.get(name);
  }

  themeService = inject(ThemeService);

  darkMode = computed<CustomToggle>(() => {
    return {
      toggleOff: {
        icon: 'light_mode',
        label: 'OFF'
      },
      toggleOn: {
        icon: 'dark_mode',
        label: 'ON'
      },
      disabled: false
    }
  });
}
