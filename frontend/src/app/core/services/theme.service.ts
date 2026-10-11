import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    // The index.html bootstrap script applies the saved theme before first paint.
    // Read the same preference here so the toggle always reflects the active theme.
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('knowexp-theme') ?? localStorage.getItem('theme');
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }

    const dark = savedTheme === 'dark' ||
      (savedTheme !== 'light' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme(dark, false);
  }

  toggle(): void {
    this.applyTheme(!this.isDark(), true);
  }

  private applyTheme(value: boolean, persist: boolean): void {
    this.isDark.set(value);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', value);
      document.documentElement.style.colorScheme = value ? 'dark' : 'light';
    }
    if (persist) {
      try {
        localStorage.setItem('knowexp-theme', value ? 'dark' : 'light');
        localStorage.setItem('theme', value ? 'dark' : 'light');
      } catch {
        // Theme still applies for the current session if storage is unavailable.
      }
    }
  }
}
