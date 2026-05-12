import { CanActivateFn } from '@angular/router';
// import { AppInitializeService } from '../../core/services/app-initialize.service';
import { inject } from '@angular/core';
import { RouterService } from '../services/router.service';

const canActivate = (): boolean => {
  // const appInitService = inject(AppInitializeService);

  // appInitService.init();

  const routerService = inject(RouterService);

  routerService.navigateTo('/admin/dashboard');

  return true;
};

export const initGuard: CanActivateFn = () => canActivate();
