import { computed, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme = signal<Theme>(this.getInitialTheme());

  current = this.theme.asReadonly();

  init() {
    this.applyTheme(this.theme());
  }

  toggle() {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  isDarkMode = computed(() => this.theme() === 'dark');

  private applyTheme(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark' ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),);
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
