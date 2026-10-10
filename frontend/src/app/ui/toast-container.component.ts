import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../core/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-stack" role="region" aria-label="Notifications" aria-live="polite">
      <article *ngFor="let toast of notifications.items(); trackBy: trackToast" class="app-toast" [ngClass]="'toast-' + toast.kind" [attr.role]="toast.kind === 'error' ? 'alert' : 'status'">
        <div class="toast-icon"><app-icon [name]="iconName(toast.kind)" /></div>
        <div class="toast-content"><strong>{{toast.title}}</strong><p>{{toast.message}}</p></div>
        <button type="button" class="toast-dismiss" (click)="notifications.dismiss(toast.id)" aria-label="Dismiss notification"><app-icon name="close" /></button>
      </article>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public notifications: ToastService) {}
  trackToast(_: number, item: {id: number}): number { return item.id; }
  iconName(kind: string): string { return kind === 'success' ? 'check-circle' : kind === 'warning' ? 'alert-triangle' : kind === 'error' ? 'alert-circle' : 'info'; }
}
