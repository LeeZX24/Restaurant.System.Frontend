import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, CanMatchFn } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";
import { RouterService } from "../services/router.service";

const canActivate = (): boolean => {
  const routeService = inject(RouterService);
  const authService = inject(AuthService);

  if(authService.isLoggedIn) {
      return true;
    }

    routeService.gotoLogin();
    return false;
}

export const authGuard: CanActivateFn = () => canActivate();
export const authChildGuard: CanActivateChildFn = () => canActivate();
export const authMatchGuard: CanMatchFn = () => canActivate();
