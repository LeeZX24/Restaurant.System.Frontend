import { NavigationService } from '../../navigation.service';
import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavItem, NavMenuType } from '../../navigation';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { RouterService } from '../../../../services/router.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rs-nav-item-group-control',
  imports: [MatExpansionModule, NavItemControl, MatIconModule],
  templateUrl: './nav-item-group-control.html',
  styleUrl: './nav-item-group-control.css',
})
export class NavItemGroupControl {
  private routerService = inject(RouterService);
  private navService = inject(NavigationService);
  protected readonly itemType = NavMenuType;
  item = input<NavItem>();

  isExpanded = model(false);
  isHovered = signal(false);

  isLastItem = signal(false);
  hasSecondLayer = signal(false);
  isGroupItemHovered = signal(false);


  isGroupExpanded = signal(false);

  // output
  navigationClicked = output();
  subGroupHovered = output<boolean>();

  get navigationItem() {return this.item() as NavItem; }
  set navigationItem(value) { this.navigationItem = value; }

  get hasParent() { return this.navService.hasParentNavigation(this.navigationItem); }
  get isCurrentRoute() { return this.routerService.isCurrentRoute(this.navigationItem.route); }
  constructor() {
    effect(() => {
      if (!this.isExpanded()) {
        this.isGroupExpanded.set(false);
      } else {
        if (this.isChildActive()) {
          this.isGroupExpanded.set(true);
        }
      }

      if(this.item()?.children) {
        const items = this.item()?.children ?? [];
        items.forEach((child) => {
          if(child.children) {
            this.hasSecondLayer.set(true);
          }
        });
      }
    });
  }



  toggle() {
    if (this.isExpanded()) {
      this.isGroupExpanded.update((v) => !v);
    }
  }

  isChildActive = computed(() => {
    const currentPath = this.routerService.currentPath();
    const children = this.item()?.children;

    if (!children || children.length === 0) {
      return false;
    }

    return this.hasActiveDescendant(children, currentPath);
  });

  private hasActiveDescendant(items: NavItem[], targetRoute: string): boolean {
    for (const item of items) {
      // 1. Terminal evaluation check: If matching route found, return immediate success path
      if (item.route === targetRoute) {
        return true;
      }

      // 2. N-th Layer Branch Detection: If the sub-element contains child paths, step down recursively
      if (item.children && item.children.length > 0) {
        if (this.hasActiveDescendant(item.children, targetRoute)) {
          return true; // Bubble the confirmation back up the execution call stack
        }
      }
    }

    // No deep node tracks matched the current navigation parameter target path lookups
    return false;
  }

  onNavigationClicked() {
    this.isExpanded.set(false);
    this.isGroupExpanded.set(false);
    this.navigationClicked.emit();
  }

  onMouseEntered() {
    this.isHovered.set(true);
    if(this.hasSecondLayer()) {
      this.isGroupItemHovered.set(true);

      if(this.item()?.children) {
        const items = this.item()?.children ?? [];
        items.forEach((child, index) => {

          if(index === items.length - 1) {
            this.isLastItem.set(true);
          }
        });
      }
    }
  }

  onMouseLeave() {
    this.isHovered.set(false);
    if(this.hasSecondLayer())
      this.isGroupItemHovered.set(false);
  }

  onfirstLayerHovered() {
    return this.hasSecondLayer() && this.isLastItem()
  }

  onChildNavigationClick() {
    this.isExpanded.set(false);
    this.isGroupExpanded.set(false);
    this.navigationClicked.emit();
  }

  isInActivePath(): boolean {
    return this.routerService.isCurrentRoute(this.navigationItem.route) || this.hasParent;
  }
}
