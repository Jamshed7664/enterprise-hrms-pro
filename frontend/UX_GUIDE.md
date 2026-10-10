# UI Feedback Developer Guide

All HTTP requests initiated by Angular's `HttpClient` automatically use the network loading system and toast feedback, through `uiInterceptor` in `src/main.ts`.

## Manual notifications

In a standalone component:

```ts
import { ToastService } from './core/toast.service'; // adjust relative path
constructor(private toast: ToastService) {}
// Then use:
this.toast.success('Employee saved successfully');
this.toast.warning('Please complete all required fields');
this.toast.error('Unable to save employee');
this.toast.info('Showing the latest data');
```

Toasts appear in the top-right, auto-dismiss, and can be closed individually. Avoid manually showing another success toast for a mutation if the automatic interceptor is already sending one.

## Icons

```ts
import { IconComponent } from '../../ui/icon.component';
@Component({ standalone: true, imports: [IconComponent], ... })
```

```html
<app-icon name="users" />
<app-icon name="calendar" />
<app-icon name="check-circle" />
<app-icon name="edit" />
```

The `IconComponent` uses inline SVG paths and inherits the parent's text color. Add more names to its `ICONS` map when needed.

## Loading indicator

The global spinner appears after a 220 ms delay to avoid flashing for very fast requests. A 3px progress strip indicates pending requests immediately. Concurrent requests share one spinner; completion and HTTP errors always decrement the count via `finalize`.
