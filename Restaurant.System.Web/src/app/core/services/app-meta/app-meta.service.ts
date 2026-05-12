import { Injectable } from '@angular/core';

export interface AppMeta {
  version: string;
  channel: 'beta' | 'release' | 'dev';
  buildTime: string;
}

@Injectable({ providedIn: 'root' })
export class AppMetaService {
  private _meta: AppMeta | null = null;

  get meta(): AppMeta {
    if (!this._meta) {
      if (typeof window !== 'undefined' && window.APP_META) {
        this._meta = window.APP_META;
      } else {
        this._meta = {
          version: 'DEV',
          channel: 'dev',
          buildTime: new Date().toISOString(),
        };
      }
    }
    return this._meta;
  }
}
