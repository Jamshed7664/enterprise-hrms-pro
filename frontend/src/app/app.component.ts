import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './ui/toast-container.component';
import { LoadingOverlayComponent } from './ui/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, LoadingOverlayComponent],
  template: '<router-outlet /><app-toast-container /><app-loading-overlay />'
})
export class AppComponent {}
