import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { RouterService } from '../../shared/services/router.service';
import { AuthService } from '../services/auth/auth.service';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const routerService = inject(RouterService);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);


  let token = '';

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token') || '';
  }

  const authReq = token ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401 || token) {
        authService.clearSession();
        routerService.gotoLogin();
      }
      
      return throwError(() => error);
    })
  );
};