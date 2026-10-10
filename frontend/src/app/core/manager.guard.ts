import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const managerGuard: CanActivateFn = () =>
  ['ADMIN','HR_MANAGER'].includes(localStorage.getItem('hrms_role') || '')
    ? true : inject(Router).createUrlTree(['/settings']);
