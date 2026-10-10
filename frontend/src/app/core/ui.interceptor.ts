import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';

const MUTATION_LABELS: Record<string, string> = {
  employees: 'Employee', departments: 'Department', attendance: 'Attendance',
  leaves: 'Leave request', timesheets: 'Timesheet', payroll: 'Payroll record',
  candidates: 'Candidate', performance: 'Performance review', documents: 'Document',
  profile: 'Profile', admin: 'Administration', settings: 'Settings', auth: 'Account'
};

export const uiInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const finish = loading.begin();
  const path = request.url.split('?')[0];
  const action = path.split('/').filter(Boolean).slice(-2);
  const resource = path.split('/api/')[1]?.split('/')[0] || '';
  const isLogin = path.endsWith('/auth/login');
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);

  return next(request).pipe(
    tap({ next: () => {
      if (!isMutation) return;
      if (isLogin) { toast.success('Signed in successfully', 'Welcome back'); return; }
      const item = MUTATION_LABELS[resource] || 'Record';
      const verb = request.method === 'DELETE' ? 'deleted' : request.method === 'POST' ? 'saved' : 'updated';
      const detail = action.includes('approve') ? 'approved' : action.includes('reject') ? 'rejected' : verb;
      toast.success(`${item} ${detail} successfully`);
    } }),
    catchError((error: HttpErrorResponse) => {
      // Optional missing profile image is handled by the profile component.
      if (path.endsWith('/image-file') && error.status === 404) return throwError(() => error);
      const message = error.status === 0 ? 'Cannot reach the HRMS API. Check that Spring Boot is running.'
        : error.status === 401 && !isLogin ? 'Your session has expired. Please sign in again.'
        : error.status === 401 && isLogin ? 'Invalid email or password.'
        : error.status === 403 ? 'You do not have permission to perform this action.'
        : error.status === 409 ? 'This record conflicts with existing data.'
        : error.status === 400 ? (error.error?.message || 'Please review the entered information.')
        : error.error?.message || `Request failed (HTTP ${error.status}).`;
      if ([400, 403, 409, 422].includes(error.status)) { toast.warning(String(message)); }
      else { toast.error(String(message)); }
      return throwError(() => error);
    }),
    finalize(finish)
  );
};
