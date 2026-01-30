export interface AppMeta {
  version: string;
  channel: 'beta' | 'release' | 'dev';
  buildTime: string;
}

declare global {
  interface Window {
    APP_META?: AppMeta;
  }
}

export function getAppMeta(): AppMeta {
  if (typeof window !== 'undefined' && window.APP_META) {
    return window.APP_META;
  }

  return {
    version: 'DEV',
    channel: 'dev',
    buildTime: new Date().toISOString()
  };
}
