import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);
  private location = inject(Location);

  currentPath = signal<string>('');
  navOptn: NavigationExtras = { skipLocationChange: true, replaceUrl: true };

  private go(path: string, options: NavigationExtras = this.navOptn) {
    this.currentPath.set(path);
    return this.router.navigate([path], { ...options }).then(() => {
      this.location.replaceState('/');
    });
  }

  public gotoLogin(): void {
    this.go('/login');
  }

  public gotoRegister(): void {
    this.go('/register');
  }

  public navigateTo(path: string, options?: NavigationExtras) {
    this.go(path, options);
  }
}
