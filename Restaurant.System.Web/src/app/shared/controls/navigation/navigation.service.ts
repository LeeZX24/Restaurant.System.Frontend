import { Injectable, signal } from '@angular/core';
import { NavItem } from './navigation';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private expanded = signal<Set<string>>(new Set());
  private hovered = signal<NavItem | null>(null);

  isExpanded(key: string): boolean {
    return this.expanded().has(key);
  }

  toggle(key: string) {
    console.log('TOGGLE BEFORE:', key, this.expanded());

    const set = new Set(this.expanded());

    if (set.has(key)) {
      set.delete(key);
    } else {
      set.add(key);
    }

    this.expanded.set(set);

    console.log('TOGGLE AFTER:', this.expanded());
  }

  collapseAll() {
    this.expanded.set(new Set());
  }

  setHovered(item: NavItem | null) {
    this.hovered.set(item);
  }

  hoveredItem() {
    return this.hovered.asReadonly();
  }

  findRoutePath(
    nodes: NavItem[],
    target: NavItem,
    base = '/admin'
  ): string | null {

    const dfs = (node: NavItem, path: string[]): string | null => {
      const nextPath = node.route ? [...path, node.route] : path;

      if (node === target) {
        return base + '/' + nextPath.join('/');
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
