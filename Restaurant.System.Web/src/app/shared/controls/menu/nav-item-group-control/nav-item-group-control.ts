import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavItem } from '../navigation';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { RouterService } from '../../../services/router.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rs-nav-item-group-control',
  imports: [MatExpansionModule, NavItemControl, MatIconModule],
  templateUrl: './nav-item-group-control.html',
  styleUrl: './nav-item-group-control.css',
})
export class NavItemGroupControl {
  private routerService = inject(RouterService);
  navItem = input<NavItem>();
  isExpanded = model(false);
  isHovered = signal(false);

  isGroupExpanded = signal(false);

  hasSecondLayer = signal(false);

  constructor() {
    effect(() => {
      if (!this.isExpanded()) {
        this.isGroupExpanded.set(false);
      } else {
        if (this.isChildActive()) {
          this.isGroupExpanded.set(true);
        }
      }

      if (!this.navItem()?.children) {
        this.hasSecondLayer.set(true);
      } else {
        this.hasSecondLayer.set(false);
      }
    });
  }

  navigationClicked = output();

  toggle() {
    if (this.isExpanded()) {
      this.isGroupExpanded.update((v) => !v);
    }
  }

  isChildActive = computed(() => {
    return (
      this.navItem()?.children?.some((child) => this.routerService.currentPath() === child.route) ??
      false
    );
  });

  onNavigationClicked() {
    this.isExpanded.set(false);
    this.isGroupExpanded.set(false);
    this.navigationClicked.emit();
  }

  onItemHovered() {
    this.isHovered.set(true);
  }
}
