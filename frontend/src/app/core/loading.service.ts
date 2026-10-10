import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly pending = signal(0);
  readonly visible = signal(false);
  private delayTimer: ReturnType<typeof setTimeout> | undefined;

  begin(): () => void {
    this.pending.update(n => n + 1);
    if (this.pending() === 1) {
      this.delayTimer = setTimeout(() => {
        if (this.pending() > 0) this.visible.set(true);
      }, 220);
    }
    let ended = false;
    return () => {
      if (ended) return;
      ended = true;
      this.pending.update(n => Math.max(0, n - 1));
      if (this.pending() === 0) {
        clearTimeout(this.delayTimer);
        this.visible.set(false);
      }
    };
  }
}
