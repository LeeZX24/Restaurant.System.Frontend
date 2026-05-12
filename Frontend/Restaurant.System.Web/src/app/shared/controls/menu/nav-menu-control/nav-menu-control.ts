import { Component, input, model, output } from '@angular/core';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { NavItemGroupControl } from '../nav-item-group-control/nav-item-group-control';
import { NAV_DATA } from '../navigation';

@Component({
  selector: 'rs-nav-menu-control',
  imports: [NavItemControl, NavItemGroupControl],
  templateUrl: './nav-menu-control.html',
  styleUrl: './nav-menu-control.css',
})
export class NavMenuControl {
  isExpanded = model(false);
  isHovered = input(false);
  navItems = NAV_DATA;

  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output();

  onNavigationClicked() {
    this.isExpanded.set(false);
    this.toggle.emit();
  }
}
