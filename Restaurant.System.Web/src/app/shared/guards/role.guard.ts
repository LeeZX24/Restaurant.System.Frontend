import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { CanActivateFn } from '@angular/router';
import { UserDto } from '../models/dtos/user.dto';
import { RouterService } from '../services/router.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const routerService = inject(RouterService);

  const user = authService.getCurrentUserValue() as UserDto;
  const allowedRoles = route.data?.['roles'] as string[];

  if (!user) {
    routerService.gotoLogin();
  }

  if (!allowedRoles || !allowedRoles.includes(user.userType.toString())) {
    routerService.navigateTo('/error/403');
  }

  return true;
};
