import { isPlatformBrowser } from '@angular/common';
import { computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';
type Theme = 'light' | 'dark';

@Service()
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly preference = signal<ThemePreference>(this.getInitialPreference());

  private readonly isSystemDark = signal(false);

  readonly current = this.preference.asReadonly();

  isDarkMode = computed(() => this.preference() === 'system' ?
    this.isSystemDark() : this.preference() === 'dark');

  init() {
    if(!isPlatformBrowser(this.platformId)) return;

    const mediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    this.isSystemDark.set(mediaQuery.matches);
    this.applyTheme();

    mediaQuery.addEventListener('change', event => {
      this.isSystemDark.set(event.matches);

      if(this.preference() === 'system') this.applyTheme()
    })
  }

  toggle() {
    this.setTheme(this.preference() === 'dark' ? 'light' : 'dark');
  }

  setTheme(preference: ThemePreference) {
    this.preference.set(preference);
    if(isPlatformBrowser(this.platformId))
      localStorage.setItem('theme', preference);
    this.applyTheme();
  }

  private applyTheme() {
    if(!isPlatformBrowser(this.platformId)) return;

    const isDark = this.isDarkMode();

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }

  private getInitialPreference(): ThemePreference {
    if(!isPlatformBrowser(this.platformId)) return 'system';

    const saved = localStorage.getItem('theme');

    if (
      saved === 'system' ||
      saved === 'light' ||
      saved === 'dark'
    ) {
      return saved;
    }

    return 'light';
  }
}
