import { InjectionToken } from '@angular/core';
import { AppConfig } from './app-config.model';
import { getAppConfig } from './app-config.state';

export const APP_CONFIG = new InjectionToken<AppConfig>(
  'APP_CONFIG',
  { factory: () => getAppConfig() }
);
