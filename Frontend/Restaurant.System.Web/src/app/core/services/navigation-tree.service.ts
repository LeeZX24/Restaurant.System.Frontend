import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

export interface NavTreeStep {
  label: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class NavigationTreeService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // A Signal that updates whenever the route changes
  readonly currentTree = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.buildTree(this.activatedRoute.root)),
    ),
    { initialValue: [] as NavTreeStep[] },
  );

  private buildTree(route: ActivatedRoute, path = '', tree: NavTreeStep[] = []): NavTreeStep[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return tree;

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      if (routeURL !== '') {
        path += `/${routeURL}`;
      }

      let label = child.snapshot.data['title'];

      if (!label && child.snapshot.params['module']) {
        label = this.formatTitle(child.snapshot.params['module']);
      }

      if (label) {
        tree.push({ label, path });
      }

      return this.buildTree(child, path, tree);
    }
    return tree;
  }

  private formatTitle(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
