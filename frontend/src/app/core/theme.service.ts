import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(false);

  constructor(@Inject(DOCUMENT) private document: Document) {
    const saved = localStorage.getItem('hrms_theme');
    const useDark = saved === 'dark' || (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    this.set(useDark ? 'dark' : 'light');
  }

  toggle(): void {
    this.set(this.dark() ? 'light' : 'dark');
  }

  set(theme: 'light' | 'dark'): void {
    const isDark = theme === 'dark';
    this.dark.set(isDark);
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hrms_theme', theme);
  }
}
