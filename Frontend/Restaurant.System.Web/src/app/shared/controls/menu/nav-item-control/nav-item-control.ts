import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from '../navigation';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'rs-nav-item-control',
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  templateUrl: './nav-item-control.html',
  styleUrl: './nav-item-control.css',
})
export class NavItemControl {
  navItem = input<NavItem>();
  isExpanded = input(false);
  isChild = input(false);

  isHovered = signal(false);

  routerService = inject(RouterService);
  navigationClicked = output();

  isActive = computed(() => {
    return this.routerService.currentPath() === this.navItem()?.route;
  });

  handleNavigate() {
    if (this.isActive()) return;

    const path = this.navItem()?.route;
    if (path) {
      this.routerService.navigateTo(path, { skipLocationChange: true });
      this.navigationClicked.emit();
    }
  }
}
