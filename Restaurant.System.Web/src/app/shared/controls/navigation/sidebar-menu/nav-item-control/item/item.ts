import { Component, computed, input } from '@angular/core';
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
  isGroupExpanded = input(false);

  //Output
  //#endregion

  //#region : State
  //#endregion

  // #region : Dedependencies Injection
  // #endregion

  //#region : Helper
  //#endregion

  //#region : Getter & Setter
  //#endregion

  //#region : Computed
  hasChildren = computed(() => !!this.item()?.children?.length);
  //#endregion

  //#region : Lifecycle

  //#endregion

  //#region : Logic
  //#endregion
}
