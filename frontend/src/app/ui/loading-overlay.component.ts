import { Component } from '@angular/core';
import { LoadingService } from '../core/loading.service';
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  template: `
    @if (loading.visible()) {
      <div class="loading-backdrop" role="status" aria-live="polite" aria-label="Loading HRMS data">
        <div class="loading-card"><div class="loading-spinner" aria-hidden="true"></div><strong>Please wait</strong><span>Updating your workspace…</span></div>
      </div>
    }
    @if (loading.pending() > 0) { <div class="loading-progress" aria-hidden="true"><span></span></div> }
  `
})
export class LoadingOverlayComponent { constructor(public loading: LoadingService) {} }
