import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
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
  item = input<NavItem | null>(null);
  items = input<NavItem[]>([]);
  isExpanded = model(false);
  depth = input(0);
  hoveredItem = input<NavItem | null>(null);
  closeNav = input(false);

  navigationClicked = output<void>();
  hoveredItemChange = output<NavItem | null>();
  //#endregion

  //#region : State

  //#endregion

  // #region : Dedependencies Injection
  routerService = inject(RouterService);
  navService = inject(NavigationService);
  // #endregion

  //#region : Helper
  protected readonly itemType = NavMenuType;
  //#endregion

  //#region : Getter & Setter
  //#endregion

  //#region : Computed
  private safeItem = computed(() => this.item());

  isActive = computed(() => {
    const item = this.safeItem();
    if(!item) return false;

    return this.routerService.currentPath() === item.route;
  });

  hasChildren = computed(() => {
    const item = this.safeItem();
    return (item?.children?.length ?? 0) > 0;
  });

  children = computed(() => {
    return this.safeItem()?.children ?? [];
  });

  isHovered = computed(() => {
    const hovered = this.hoveredItem();
    const item = this.item();

    return !!hovered && !!item && hovered === item;
  });

  itemKey = computed(() => {
    const item = this.safeItem();
    return item?.route ?? item?.label ?? null;
  });
  //#endregion

  //#region : Lifecycle

  //#endregion

  //#region : Logic
  onMouseEnter() {
    const item = this.safeItem();
    if(!item) return;

    this.hoveredItemChange.emit(item);
  }

  onMouseLeave() {
    this.hoveredItemChange.emit(null);
  }

  getKey(item: NavItem): string {
    return item.route || item.label;
  }

  handleNavigate() {
    const item = this.safeItem();
    if(!item) return;

    if (this.isActive()) return;

    if(this.hasChildren()) {
      const key = this.itemKey();
      if (!key) return;

      this.navService.toggle(this.getKey(item));
      return;
    }

    const fullRoute = this.navService.findRoutePath(NAV_DATA, item);

    if(!fullRoute) return;

    this.routerService.navigateTo(fullRoute, { skipLocationChange: true });

    this.navigationClicked.emit();
  }
  //#endregion
}
