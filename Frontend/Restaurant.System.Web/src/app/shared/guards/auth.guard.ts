import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanMatch, GuardResult, MaybeAsync, Route, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "../../core/services/auth/auth.service";
import { RouterService } from "../services/router.service";


export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {
  private routeService = inject(RouterService);
  private authService = inject(AuthService);

  _canActivate$() {
    if(this.authService.isLoggedIn) {
      return true;
    }

    this.routeService.gotoLogin();
    return false;
  }

  canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this._canActivate$();
  }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this._canActivate$();
  }

  canMatch(_route: Route, _segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return this._canActivate$();
  }
}
