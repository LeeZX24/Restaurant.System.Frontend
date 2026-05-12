import { Component, computed, inject } from '@angular/core';
import { NavigationTreeService } from '../../../../core/services/navigation-tree.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'rs-navigation-tree',
  imports: [],
  templateUrl: './navigation-tree.component.html',
  styleUrl: './navigation-tree.component.css',
})
export class NavigationTreeComponent {
  routerSerivce = inject(RouterService);
  navTreeService = inject(NavigationTreeService);

  showNav = computed(() => {
    const url = this.routerSerivce.currentUrl();
    const tree = this.navTreeService.currentTree();
    return !url.includes('/dashboard') && tree.length > 0;
  });
}
