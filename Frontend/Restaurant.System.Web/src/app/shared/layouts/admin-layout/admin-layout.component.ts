import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderControl } from '../../controls/header-control/header-control';
import { NavItemControl } from '../../controls/nav-item-control/nav-item-control';
import { NavItemGroupControl } from '../../controls/nav-item-group-control/nav-item-group-control';
import { NAV_DATA } from '../../models/navigation';

@Component({
  selector: 'rs-admin-layout',
  imports: [RouterOutlet, HeaderControl, NavItemControl, NavItemGroupControl],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  navItems = NAV_DATA;
  isExpanded = signal(false);
}
