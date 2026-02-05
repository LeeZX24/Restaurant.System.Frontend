import { HttpClient } from '@angular/common/http';
import { inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { AppConfig } from '../shared/configs/app-config.model';
import { environment } from '../../environments/environment';
import { setAppConfig } from '../shared/configs/app-config.state';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export async function loadAppConfig() {
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);

  let cfg: AppConfig;

  if (isPlatformBrowser(platformId)) {
    const loc = window.location;

    if (isDevMode()) {
      if(loc.port != '5000') {
        cfg = { baseUrl: `https://${window.location.hostname.replace('4200.', '5000.')}`}
      } else {
        const response = await firstValueFrom(
          http.get<AppConfig>('assets/config.json')
        );

        if (!response) {
          throw new Error('Dev config not found or invalid');
        }

        cfg = response;
      }
    } else {
      cfg = { baseUrl: environment.baseUrl };
    }

    setAppConfig(cfg);
  }
}
