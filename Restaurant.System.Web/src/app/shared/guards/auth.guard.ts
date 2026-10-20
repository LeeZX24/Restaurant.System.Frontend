import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

// const canActivate = async (route) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if(authService.isLoggedIn) return true;

//   const loginRoute
  
//   return authService.isLoggedIn ? true : router.createUrlTree(['/auth/login']);
// };

// export const authGuard: CanActivateFn = (route) => canActivate(route);
// export const authChildGuard: CanActivateChildFn = (route) => canActivate(route);
// export const authMatchGuard: CanMatchFn = (route) => canActivate(route);

const canActivate = (loginRoute: string) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn) return true;


  return router.createUrlTree([loginRoute]);
}

export const authGuard: CanActivateFn = (route) => canActivate(route.data['loginRoute'] ?? '/admin/auth/login');
export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if(authService.isLoggedIn) return true;

  const loginRoute = childRoute.parent?.data['loginRoute'] ?? '/admin/auth/login';
  
  return router.createUrlTree([loginRoute]);
}

export const authMatchGuard: CanMatchFn = () => canActivate('/admin/auth/login');