import { inject, Injectable } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { NavItem } from './navigation';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private routerService = inject(RouterService);

  public hasParentNavigation(item: NavItem): boolean {
    return item.children?.some((child) =>
      this.isRouteInTree(child)
    ) ?? false;
  }

  private isRouteInTree(item: NavItem): boolean {
    if (this.routerService.isCurrentRoute(item.route.toString())) {
      return true;
    }

    return item.children?.some((child) =>
      this.isRouteInTree(child)
    ) ?? false;
  }

  public getFullRoute(item: NavItem, parents: NavItem[] = []): string {
    return [...parents.map(p => p.route), item.route].join('/');
  }
}
