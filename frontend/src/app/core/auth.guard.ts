import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
export const authGuard: CanActivateFn = () => {
  const ok = !!localStorage.getItem("hrms_token");
  return ok ? true : inject(Router).createUrlTree(["/login"]);
};
