import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/components/redirect/redirect.component').then(
            (c) => c.RedirectComponent,
          ),
      },
      {
        // Auth
        path: 'auth',
        loadComponent: () =>
          import('./shared/layouts/auth-layout/auth-layout.component').then(
            (c) => c.AuthLayoutComponent,
          ),
        children: [
          {
            path: 'login',
            loadComponent: () =>
              import('./auth/login/login.component').then((c) => c.LoginComponent),
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./auth/register/register.component').then((c) => c.RegisterComponent),
          },
        ],
      },
      {
        // Admin
        path: 'admin',
        loadComponent: () =>
          import('./shared/layouts/admin-layout/admin-layout.component').then(
            (c) => c.AdminLayoutComponent,
          ),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./shared/components/redirect/redirect.component').then(
                (c) => c.RedirectComponent,
              ),
            data: { redirectTo: '/admin/dashboard' },
          },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./pages/admin-staff/dashboard/dashboard.component').then(
                (c) => c.DashboardComponent,
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./pages/admin-staff/settings/settings.component').then(
                (c) => c.SettingsComponent,
              ),
          },
        ],
      },
      //,
      // { // Customer
      // }
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
