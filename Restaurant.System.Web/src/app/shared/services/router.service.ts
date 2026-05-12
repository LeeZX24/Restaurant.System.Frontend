import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);
  private location = inject(Location);

  currentPath = signal<string>('');
  parentPath = signal<string>('');
  navOptn: NavigationExtras = { skipLocationChange: true, replaceUrl: true };

  currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private go(path: string, options: NavigationExtras = this.navOptn) {
    this.currentPath.set(path);
    return this.router.navigate([path], { ...options }).then(() => {
      this.location.replaceState('/');
    });
  }

  public gotoLogin(): void {
    this.navigateTo('/admin/auth/login');
  }

  public gotoRegister(): void {
    this.navigateTo('/admin/auth/register');
  }

  public navigateTo(path: string, options?: NavigationExtras) {
    this.go(path, options);
  }
}
