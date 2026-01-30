import type { AppConfig } from './app-config.model';

let config: AppConfig | null = null;

export function setAppConfig(value: AppConfig) {
  config = value;
}

export function getAppConfig(): AppConfig {
  if (!config) {
    throw new Error('AppConfig not loaded yet');
  }
  return config;
}
