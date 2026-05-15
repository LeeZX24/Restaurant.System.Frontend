import { Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterService } from '../../../../../services/router.service';
import { NavItem, NavMenuType } from '../../../navigation';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'rs-nav-item',
  imports: [MatIconModule],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class ItemView {
  //#region : Input / Output
  //Input
  item = input<NavItem>();
  isExpanded = input(false);
  depth = input(0);

  //Output
  isItemHovered = output<boolean>();
  navigationClicked = output();
  //#endregion

  //#region : State
  isHovered = signal(false);
  isGroupHovered = signal(false);

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
    if (this.isActive()) return;

    const path = this.item()?.route;
    if (path) {
      this.routerService.navigateTo(path, { skipLocationChange: true });
      this.navigationClicked.emit();
    }
  }
  //#endregion
}
