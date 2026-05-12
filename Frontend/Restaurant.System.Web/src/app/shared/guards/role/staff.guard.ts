import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserType } from '../../models/dtos/user.dto';

const canActivate = (): boolean => {
  const authService = inject(AuthService);

  if (authService.getCurrentUserValue()) {
    const user = authService.getCurrentUserValue();
    console.log('User => ', user);
    if (user?.userType === UserType.Staff) {
      return true;
    }
  }

  return false;
};

export const staffRoleGuard: CanActivateFn = () => canActivate();
