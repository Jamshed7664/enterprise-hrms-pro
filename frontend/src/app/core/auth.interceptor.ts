import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('hrms_token');
  const router = inject(Router);
  const outgoing = token && !req.url.endsWith('/auth/login') ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}}) : req;
  return next(outgoing).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401 && !req.url.endsWith('/auth/login')) {
      ['hrms_token', 'hrms_name', 'hrms_employee_id', 'hrms_role', 'hrms_email'].forEach(k => localStorage.removeItem(k));
      router.navigate(['/login']);
    }
    return throwError(() => error);
  }));
};
