import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./shared/layouts/dialog-layout/dialog-layout.component').then(c => c.DialogLayoutComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./shared/layouts/content-layout/content-layout.component').then(c => c.ContentLayoutComponent),
            children: [
              { // Auth
                path: '',
                loadComponent: () => import('./shared/layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
                children: [
                  {
                    path: 'redirect',
                    loadComponent: () => import('./shared/components/redirect/redirect.component').then(c=> c.RedirectComponent),
                  },
                  {
                    path: 'login',
                    loadComponent: () => import('../auth/login/login.component').then(c => c.LoginComponent)
                  },
                  {
                    path: 'register',
                    loadComponent: () => import('../auth/register/register.component').then(c => c.RegisterComponent)
                  }
                ]
              },
              { // Admin
                path: '',
                loadComponent: () => import('./shared/layouts/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
                canActivate: [ AuthGuard ],
                children: [
                  {
                    path: '',
                    loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
                  }
                ]
              }
              //,
              // { // Customer
              // }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
  // default route
  // {
  //   path: '',
  //   component: LayoutComponent,
  //   children: [
  //     {
  //       path: 'auth',
  //       loadChildren: () => import('../auth/auth.routes').then(c => c.AuthRoutes),
  //     },
  //   ],
  // },

  // {
  //   path: '',
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: '/login',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },

];
