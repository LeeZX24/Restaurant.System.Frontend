import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);

  public go(path: string) {
    return this.router.navigate([path], { skipLocationChange: true });
  }

  public gotoLogin(): void {
    this.go('/login');
  }

  public gotoRegister(): void {
    this.go('/register');
  }
}
