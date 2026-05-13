import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NavItemControl } from '../nav-item-control/nav-item-control';
import { NavItemGroupControl } from '../nav-item-group-control/nav-item-group-control';
import { NAV_DATA } from '../navigation';

@Component({
  selector: 'rs-nav-menu-control',
  imports: [NavItemControl, NavItemGroupControl],
  templateUrl: './nav-menu-control.html',
  styleUrl: './nav-menu-control.css',
})
export class NavMenuControl implements AfterViewInit {
  isExpanded = model(false);
  isHovered = input(false);
  navItems = NAV_DATA;

  @ViewChildren('flipItem', { read: ElementRef })
  flipItems!: QueryList<ElementRef<HTMLElement>>;

  private firstPositions = new Map<string, DOMRect>();

  readonly displayedNavItems = computed(() => {
    // Expanded sidebar
    if (this.isExpanded()) {
      return NAV_DATA;
    }

    // Collapsed sidebar
    return NAV_DATA.flatMap((item) => {
      // Normal item
      if (!item.children) {
        return [item];
      }

      // Flatten children
      return item.children;
    });
  });

  // eslint-disable-next-line @angular-eslint/no-output-native
  toggle = output();

  onNavigationClicked() {
    this.captureFirst();

    if (this.isExpanded()) {
      this.isExpanded.set(false);
      this.toggle.emit();
    }

    requestAnimationFrame(() => {
      this.runFlip();
    });
  }

  ngAfterViewInit() {
    this.captureFirst();
  }

  getFlipMap() {
    const map = new Map<string, HTMLElement>();

    this.flipItems.forEach((el) => {
      const id = el.nativeElement.getAttribute('data-id');
      if (id) map.set(id, el.nativeElement);
    });

    return map;
  }

  captureFirst() {
    this.firstPositions.clear();

    this.flipItems.forEach((item) => {
      const el = item.nativeElement;
      const id = el.dataset['id'];
      if (!id) return;

      this.firstPositions.set(id, el.getBoundingClientRect());
    });
  }

  runFlip() {
    this.flipItems.forEach((item) => {
      const el = item.nativeElement;

      const id = el.dataset['id'];
      if (!id) return;

      const first = this.firstPositions.get(id);
      if (!first) return;

      const last = el.getBoundingClientRect();

      const deltaY = first.top - last.top;

      // Start at OLD position
      el.style.transform = `translateY(${deltaY}px)`;
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        el.style.transition = 'transform 350ms cubic-bezier(0.22,1,0.36,1)';
        el.style.transform = 'translateY(0)';
      });
    });
  }
}
