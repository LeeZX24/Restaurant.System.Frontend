import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);

  public go(path: string, options?: {skipLocationChange?: boolean}) {
    return this.router.navigate([path], { ...options });
  }

  public gotoLogin(): void {
    this.go('/login', { skipLocationChange: true });
  }

  public gotoRegister(): void {
    this.go('/register', { skipLocationChange: true });
  }
}
