import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'av-theme';
  private _theme = new BehaviorSubject<'light' | 'dark'>('light');

  get theme$() {
    return this._theme.asObservable();
  }

  init() {
    const stored = localStorage.getItem(this.key) as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme: 'light' | 'dark' = stored ?? (prefersDark ? 'dark' : 'light');
    this.set(theme, false); // false = don't save again during init
  }

  set(theme: 'light' | 'dark', save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) localStorage.setItem(this.key, theme);
    this._theme.next(theme);
    this.updateMetaThemeColor();
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  private updateMetaThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]') ?? this.createMeta();
    const color = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#ffffff';
    meta.setAttribute('content', color);
  }

  private createMeta() {
    const m = document.createElement('meta');
    m.setAttribute('name', 'theme-color');
    document.head.appendChild(m);
    return m;
  }
}