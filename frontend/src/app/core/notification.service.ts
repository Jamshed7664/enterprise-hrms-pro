import { Injectable, signal } from '@angular/core';
@Injectable({providedIn:'root'})
export class NotificationService {
  readonly error = signal('');
  clear(){this.error.set('');}
  showError(text:string){this.error.set(text);}
}
