import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { CustomToggleControl } from "../../../shared/controls/custom-toggle-control/custom-toggle-control";
import { CustomToggle } from '../../../shared/controls/custom-toggle-control/custom-toggle';

@Component({
  selector: 'app-settings',
  imports: [CustomToggleControl],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
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
