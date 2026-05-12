import { InjectionToken } from '@angular/core';
import { AppConfig } from './app-config.model';

export const APP_CONFIG = new InjectionToken<Promise<AppConfig>>('APP_CONFIG');
