import { Location } from '@angular/common';
import { DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserType } from '../models/dtos/user.dto';

export type AppEntryPoint = '/' | '/member' | '/admin';

@Service()
export class RouterService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  currentPath = signal<string>('');
  parentPath = signal<string>('');
  private readonly navOptn: NavigationExtras = { skipLocationChange: true };

  readonly entryPoint = signal<AppEntryPoint>(this.getEntryPoint(window.location.pathname));

  currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private getEntryPoint(path: string): AppEntryPoint {
    const pathname = path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return '/admin';
    }

    if (pathname === '/member' || pathname.startsWith('/member/')) {
      return '/member';
    }

    return '/';
  }

  public resolveEntryPoint(): Promise<boolean> {
    const entryPoint = this.getEntryPoint(this.router.url);
    const user = this.authService.getCurrentUserValue();
    const isLoggedIn = this.authService.isLoggedIn;

    this.entryPoint.set(entryPoint);

    if (entryPoint === '/admin') {
      if (!isLoggedIn || user?.userType !== UserType.Staff) {
        return this.navigateTo('/admin/auth/login');
      }

      return this.navigateTo('/admin/dashboard');
    }

    if (entryPoint === '/member') {
      if (!isLoggedIn || user?.userType !== UserType.Member) {
        return this.navigateTo('/member/auth/login');
      }

      return this.navigateTo('/member/home');
    }

    return Promise.resolve(true);
  }

  private syncEntryPoint = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((event) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      const entryPoint = this.getEntryPoint(url);

      this.entryPoint.set(entryPoint);

      if (entryPoint !== '/') {
        this.location.replaceState(entryPoint);
      }
    });

  private async go(path: string, options: NavigationExtras = this.navOptn) {
    const entryPoint = this.getEntryPoint(path);

    console.log('[RouterService] Requested path:', path);
    console.log('[RouterService] Entry point:', entryPoint);
    console.log('[RouterService] Before navigation:', window.location.pathname);


    const success = await this.router.navigateByUrl(path, { ...options, skipLocationChange: true });

    console.log('[RouterService] Navigation success:', success);
    console.log('[RouterService] Angular URL:', this.router.url);

    if(success) {
      this.currentPath.set(path);
      this.entryPoint.set(entryPoint);
      // this.location.replaceState(entryPoint);
    }

    console.log('[RouterService] Final browser URL:', window.location.pathname);

    return success;
  }

  public gotoLogin(): Promise<boolean> {
    return this.navigateTo(
      this.entryPoint() === '/member'
        ? '/member/auth/login'
        : '/admin/auth/login',
    );
  }

  public gotoMemberLogin(): void {
    this.navigateTo('/member/auth/login');
  }

  public gotoMemberRegister(): void {
    this.navigateTo('/member/auth/register');
  }

  public navigateTo(path: string, options?: NavigationExtras) {
    return this.go(path, options);
  }

  public isCurrentRoute(route: string) {
    return this.router.url === route;
  }

  public isSettingsRoute(route: string) {
    return this.router.url.includes('settings') && this.router.url === route;
  }
}
