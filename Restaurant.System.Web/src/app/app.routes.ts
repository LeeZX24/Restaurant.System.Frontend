import { Routes } from '@angular/router';
// import { authGuard } from './shared/guards/auth.guard';
// import { initGuard } from './shared/guards/init.guard';
// import { roleGuard } from './shared/guards/role.guard';
import { UserType } from './shared/models/dtos/user.dto';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout.component').then(
        (c) => c.MainLayoutComponent,
      ),
    // canActivate: [initGuard],
    children: [
      {
        // Admin
        path: 'admin',
        loadComponent: () =>
          import('./shared/layouts/content-layout/content-layout.component').then(
            (c) => c.ContentLayoutComponent,
          ),
        children: [
          {
            path: 'auth',
            loadComponent: () =>
              import('./shared/layouts/auth-layout/auth-layout.component').then(
                (c) => c.AuthLayoutComponent,
              ),
            children: [
              {
                path: 'login',
                loadComponent: () =>
                  import('./pages/admin-staff/auth/login/login.component').then(
                    (c) => c.LoginComponent,
                  ),
              },
            ],
          },
          {
            path: '',
            loadComponent: () =>
              import('./shared/layouts/admin-layout/admin-layout.component').then(
                (c) => c.AdminLayoutComponent,
              ),
            // canActivate: [authGuard, roleGuard],
            data: { title: 'Main', roles: [UserType.Staff.toString()] },
            children: [
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
                data: { title: 'Settings' },
              },
              {
                path: 'maintenance',
                data: { title: 'Maintenance' },
                children: [
                  {
                    path: ':module',
                    loadComponent: () =>
                      import('./shared/controls/maintenance/maintenance/maintenance.component').then(
                        (c) => c.MaintenanceComponent,
                      ),
                    data: { title: '' },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        // Customer
        path: 'member',
        loadComponent: () =>
          import('./shared/layouts/content-layout/content-layout.component').then(
            (c) => c.ContentLayoutComponent,
          ),
        // canActivate: [authGuard, roleGuard],
        data: { roles: [UserType.Member.toString()] },
        children: [
          {
            path: 'auth',
            loadComponent: () =>
              import('./shared/layouts/auth-layout/auth-layout.component').then(
                (c) => c.AuthLayoutComponent,
              ),
            children: [
              {
                path: 'login',
                loadComponent: () =>
                  import('./pages/customers/auth/login/login.component').then(
                    (c) => c.LoginComponent,
                  ),
              },
              {
                path: 'register',
                loadComponent: () =>
                  import('./pages/customers/auth/register/register.component').then(
                    (c) => c.RegisterComponent,
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];
