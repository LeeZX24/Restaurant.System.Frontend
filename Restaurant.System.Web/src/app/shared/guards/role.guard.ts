import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UserDto, UserType } from '../models/dtos/user.dto';

const canAccess = (route: ActivatedRouteSnapshot): boolean | ReturnType<Router['createUrlTree']> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUserValue();
  const allowedUserTypes = route.data['userTypes'] as UserType[] | undefined;

  if(!user) {
    const isMemberRoute = allowedUserTypes?.includes(UserType.Member);

    return router.createUrlTree(
      isMemberRoute
        ? ['/member/auth/login']
        : ['/admin/auth/login'],
    );
  }

  if (
    allowedUserTypes?.length &&
    (user.userType == null || !allowedUserTypes.includes(user.userType))
  ) {
    return router.createUrlTree(['/error/403']);
  }

  return true;
};

export const roleGuard: CanActivateFn = (route) => canAccess(route);

export const roleChildGuard: CanActivateChildFn = (route) =>
  canAccess(route);