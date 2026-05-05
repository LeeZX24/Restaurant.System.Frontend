import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { NavItem } from '../../models/navigation';

@Component({
  selector: 'rs-nav-item-group-control',
  imports: [MatExpansionModule, NavItemControl],
  templateUrl: './nav-item-group-control.html',
  styleUrl: './nav-item-group-control.css',
})
export class NavItemGroupControl {
  navItem = input<NavItem>();
  isExpanded = input(false);
}
