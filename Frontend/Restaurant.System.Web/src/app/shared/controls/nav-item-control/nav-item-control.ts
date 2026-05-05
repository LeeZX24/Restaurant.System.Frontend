import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../../models/navigation';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'rs-nav-item-control',
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  templateUrl: './nav-item-control.html',
  styleUrl: './nav-item-control.css',
})
export class NavItemControl {
  navItem = input<NavItem>();
  isExpanded = input(false);
  routerService = inject(RouterService);

  isActive = computed(() => this.routerService.currentPath() === this.navItem()?.route);

  handleNavigate() {
    const path = this.navItem()?.route;
    if (path) {
      this.routerService.navigateTo(path, { skipLocationChange: true });
    }
  }
}
