import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthInterceptor, JwtInterceptor } from './core/interceptor/shared.inceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { LoadingInterceptor } from './core/interceptor/loading.interceptor';
import { loadAppConfig } from './utils/runtime-env';
import { APP_CONFIG } from './shared/configs/app-config.token';
import { getAppConfig } from './shared/configs/app-config.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        AuthInterceptor,
        JwtInterceptor,
      ])
    ),
    provideTranslateService(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    provideAppInitializer(() => loadAppConfig()),
    {
      provide: APP_CONFIG,
      useFactory: () => getAppConfig()
    }
  ]
};
