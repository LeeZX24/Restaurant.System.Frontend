import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderControl } from '../../controls/header-control/header-control';
import { NavMenuControl } from '../../controls/menu/nav-menu-control/nav-menu-control';
import { NavigationTreeComponent } from '../../controls/menu/navigation-tree/navigation-tree.component';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'rs-admin-layout',
  imports: [RouterOutlet, HeaderControl, NavMenuControl, NavigationTreeComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  routerService = inject(RouterService);
  isExpanded = signal(false);

  toggle() {
    this.isExpanded.update((v) => !v);
  }
}
