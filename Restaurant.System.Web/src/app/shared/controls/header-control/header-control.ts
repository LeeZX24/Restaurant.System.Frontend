import { CommonModule } from '@angular/common';
import { Component, computed, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../../core/services/theme.service';
import { CustomToggle } from '../custom-toggle-control/custom-toggle';
import { CustomToggleControl } from "../custom-toggle-control/custom-toggle-control";
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'rs-header-control',
  imports: [MatIconModule, CommonModule, CustomToggleControl],
  templateUrl: './header-control.html',
  styleUrl: './header-control.css',
})
export class HeaderControl {
  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output();

  themeService = inject(ThemeService);
  routerService = inject(RouterService);

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

  emit() {
    this.toggle.emit();
  }
}
