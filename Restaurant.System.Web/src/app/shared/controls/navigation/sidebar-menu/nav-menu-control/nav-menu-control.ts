import { Component, input, model, output, signal } from '@angular/core';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { NAV_DATA, NavItem, NavMenuType } from '../../navigation';

@Component({
  selector: 'rs-nav-menu-control',
  imports: [NavItemControl],
  templateUrl: './nav-menu-control.html',
  styleUrl: './nav-menu-control.css',
})
export class NavMenuControl {
  isExpanded = model(false);
  isHovered = input(false);
  navItems = NAV_DATA;
  itemType = NavMenuType;

  hoveredItem = signal<NavItem | null>(null);

  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output();


  onNavigationClicked() {
    if (this.isExpanded()) {
      this.isExpanded.set(false);
      this.toggle.emit();
    }
  }
}
