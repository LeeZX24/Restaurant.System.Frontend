import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NAV_DATA, NavItem, NavMenuType } from '../../navigation';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterService } from '../../../../services/router.service';
import { ItemView } from "./item/item";
import { NavigationService } from '../../navigation.service';

@Component({
  selector: 'rs-nav-item-control',
  imports: [CommonModule, MatIconModule, MatExpansionModule, ItemView],
  templateUrl: './nav-item-control.html',
  styleUrl: './nav-item-control.css',
})
export class NavItemControl {

  //#region : Input / Output
  readonly item = input<NavItem | null>(null);
  readonly items = input<NavItem[]>([]);
  readonly isExpanded = input(true);
  readonly depth = input(0);
  readonly closeNav = input(false);

  readonly navigationClicked = output<void>();
  //#endregion

  //#region : State

  //#endregion

  // #region : Dedependencies Injection
  readonly routerService = inject(RouterService);
  readonly navService = inject(NavigationService);
  // #endregion

  //#region : Helper
  protected readonly itemType = NavMenuType;
  //#endregion

  //#region : Getter & Setter
  //#endregion

  //#region : Computed
  private readonly  safeItem = computed(() => this.item());

  readonly isActive = computed(() => {
    const item = this.safeItem();
    if(!item) return false;

    return this.routerService.currentPath() === item.route;
  });

  readonly hasActiveDescendant = computed(() => {
    const item = this.safeItem();
    if(!item?.children) return false;
    if(!item?.children?.length) return false;
    return (this.containsActiveRoute(item?.children));
  });

  readonly isInActivePath = computed(() => {
    return this.isActive() || this.hasActiveDescendant();
  });

  readonly hasChildren = computed(() => (this.safeItem()?.children?.length ?? 0) > 0);
  readonly children = computed(() => this.safeItem()?.children ?? []);

  readonly isGroupExpanded = computed(() => {
    const key = this.itemKey();
    return !!key && this.navService.isExpanded(key);
  });

  readonly isHovered = computed(() => {
    const item = this.safeItem();
    const hovered = this.navService.hoveredItem();

    return !!hovered && !!item && this.getKey(item) === this.getKey(hovered);
  });

  itemKey = computed(() => {
    const item = this.safeItem();
    return item?.route ?? item?.label ?? null;
  });
  //#endregion

  //#region : Lifecycle
  private readonly expandActiveAncestors = effect(() => {
    const item = this.safeItem();

    if (!item?.children?.length) return;
    if (!this.hasActiveDescendant()) return;

    this.navService.expand(this.getKey(item));
  });
  //#endregion

  //#region : Logic
  onMouseEnter() {
    const item = this.safeItem();
    if(item) this.navService.setHovered(item);
  }

  onMouseLeave() {
    const item = this.safeItem();
    if(item) this.navService.setHovered(item);
  }

  getKey(item: NavItem): string {
    return item.route || item.label;
  }

  handleNavigate() {
    const item = this.safeItem();
    if(!item) return;

    if (this.isActive()) return;

    if(this.hasChildren() || item.type === NavMenuType.group) {
      this.navService.toggle(this.getKey(item));
      return;
    }

    const fullRoute = this.navService.findRoutePath(NAV_DATA, item);
    if(!fullRoute) return;

    this.routerService.navigateTo(fullRoute, { skipLocationChange: true });

    this.navigationClicked.emit();
  }

  private containsActiveRoute(items: NavItem[]): boolean {
    const currentPath = this.routerService.currentPath();

    return items.some(item => {
      if(currentPath === item.route) return true;
      return item.children ? this.containsActiveRoute(item.children) : false;
    });
  }
  //#endregion
}
