import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'warning' | 'error' | 'info';
export interface ToastMessage { id: number; kind: ToastKind; title: string; message: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly items = signal<ToastMessage[]>([]);
  private nextId = 0;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  show(kind: ToastKind, message: string, title?: string, duration?: number): void {
    const clean = String(message || '').trim();
    if (!clean) return;
    // Keep the latest four notifications, avoid duplicate API errors.
    if (this.items().some(item => item.kind === kind && item.message === clean)) return;
    const id = ++this.nextId;
    if (this.items().length >= 4) this.dismiss(this.items()[0].id);
    this.items.update(items => [...items, {
      id, kind, message: clean, title: title || ({
        success: 'Success', warning: 'Please check', error: 'Something went wrong', info: 'Information'
      } as const)[kind]
    }]);
    this.timers.set(id, setTimeout(() => this.dismiss(id), duration ?? (kind === 'error' ? 8000 : 4500)));
  }
  success(message: string, title?: string): void { this.show('success', message, title); }
  warning(message: string, title?: string): void { this.show('warning', message, title); }
  error(message: string, title?: string): void { this.show('error', message, title); }
  info(message: string, title?: string): void { this.show('info', message, title); }
  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    this.items.update(items => items.filter(item => item.id !== id));
  }
  clear(): void { for (const item of this.items()) this.dismiss(item.id); }
}
