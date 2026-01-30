import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export function getRuntimeBaseUrl(): string {
  const platformId = inject(PLATFORM_ID);
  const backendPort = 5000;
  const domain = '.app.github.dev';

  if (isPlatformBrowser(platformId)) {

    const origin = window.location.origin;

    //Github
    if(origin.includes(domain)) {
      return origin.replace(/-\d+\.app\.github\.dev/, `-${backendPort}` + domain);
    }

    return `http://localhost:${backendPort}`;
  }

  // SSR fallback (cannot detect client hostname)
  return '';
}
