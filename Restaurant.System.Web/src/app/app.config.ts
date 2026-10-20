import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptor/shared.inceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { LoadingInterceptor } from './core/interceptor/loading.interceptor';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { loadAppConfig } from './utils/runtime-env';
import { APP_CONFIG } from './shared/configs/app-config.state';
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const themeService = inject(ThemeService); 
      themeService.init();
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withComponentInputBinding()
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: APP_CONFIG,
      useFactory: () => loadAppConfig(),
    },
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    }),
  ],
};
