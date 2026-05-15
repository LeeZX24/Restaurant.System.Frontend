import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavItem, NavMenuType } from '../../navigation';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'rs-nav-item-control',
  imports: [CommonModule, MatIconModule, MatExpansionModule],
  templateUrl: './nav-item-control.html',
  styleUrl: './nav-item-control.css',
})
export class NavItemControl {
  //#region : Input / Output
  item = input<NavItem>();
  isExpanded = input(false);
  depth = input(0);

  isItemHovered = output<boolean>();
  navigationClicked = output();
  //#endregion

  //#region : State
  isHovered = signal(false);
  isGroupHovered = signal(false);

  isGroupExpanded = signal(false);
  //#endregion

  // #region : Dedependencies Injection
  routerService = inject(RouterService);
  // #endregion

  //#region : Helper
  protected readonly itemType = NavMenuType;
  //#endregion

  //#region : Getter & Setter
  get isChild() { return this.item()?.type === this.itemType.item; }
  //#endregion

  //#region : Computed
  isActive = computed(() => {
    return this.routerService.currentPath() === this.item()?.route;
  });

  hasChildren = computed(() => !!this.item()?.children?.length);
  //#endregion

  //#region : Lifecycle

  //#endregion

  //#region : Logic
  handleNavigate() {
    const path = this.item()?.route;

    if (this.isActive()) return;

    if(this.hasChildren()) {
      if(!this.isExpanded()) return;
      this.isGroupExpanded.update(v => !v);
      return;
    }

    if (path) {
      this.routerService.navigateTo(path, { skipLocationChange: true });
      this.navigationClicked.emit();
    }
  }
  //#endregion
}
