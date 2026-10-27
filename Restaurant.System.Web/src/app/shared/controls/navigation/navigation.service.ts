import { Service, signal } from '@angular/core';
import { NavItem } from './navigation';

@Service()
export class NavigationService {
  private readonly expandedKeys = signal<Set<string>>(new Set());
  private readonly hovered = signal<NavItem | null>(null);

  readonly hoveredItem = this.hovered.asReadonly();

  isExpanded(key: string): boolean {
    return this.expandedKeys().has(key);
  }

  toggle(key: string) {
    this.expandedKeys.update(current => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  expand(key: string) {
    this.expandedKeys.update(current => {
      if(current.has(key)) return current;

      const next = new Set(current);
      next.add(key);
      return next;
    });
  }

  collapse(key: string) {
    this.expandedKeys.update(current => {
      if(!current.has(key)) return current;
      
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }

  collapseAll() {
    this.expandedKeys.set(new Set());
  }

  setHovered(item: NavItem | null) {
    this.hovered.set(item);
  }

  clearHovered(item: NavItem) {
    if(this.hovered() === item) {
      this.hovered.set(null);
    }
  }

  findRoutePath(
    nodes: NavItem[],
    target: NavItem,
    base = '/admin'
  ): string | null {

    const dfs = (node: NavItem, path: string[]): string | null => {
      const nextPath = node.route ? [...path, node.route] : path;

      if (node === target) {
        return `${base}/${nextPath.join('/')}`;
      }

      for (const child of node.children ?? []) {
        const result = dfs(child, nextPath);
        if (result) return result;
      }

      return null;
    };

    for (const root of nodes) {
      const result = dfs(root, []);
      if (result) return result;
    }

    return null;
  }
}
