import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="login-page">
   <div class="login-art">
      <div class="logo-big">CJ</div>
      <span class="pill">Code With Jamshed · HRMS Pro</span>
      <h1>Make every workday feel effortless.</h1>
      <p>
         A modern people platform for employees, leave, attendance, payroll,
         hiring and more.
      </p>
      <div class="feature-grid">
         <div>✓ Real backend APIs</div>
         <div>✓ Seeded demo data</div>
         <div>✓ Profile image upload</div>
         <div>✓ Responsive UI</div>
      </div>
   </div>
   <form class="login-card" (ngSubmit)="login()">
      <span class="pill">Welcome back</span>
      <h2>Sign in to Enterprise HRMS</h2>
      <p class="muted">Use the demo administrator account.</p>
      <label
         >Email<input
            [(ngModel)]="email"
            name="email"
            type="email"
            required /></label
      ><label
         >Password<input
            [(ngModel)]="password"
            name="password"
            type="password"
            requirednpm ls zone.js
      /></label>
      <p class="error" *ngIf="error">{{error}}</p>
      <button class="btn primary wide" [disabled]="busy">
         <span *ngIf="busy" class="button-spinner" aria-hidden="true"></span>{{busy?'Signing in...':'Sign in'}}
      </button>
      <div class="demo-box">
         <b>Demo credentials</b><span>admin@hrms.dev / AdminDemo@12345</span>
      </div>
   </form>
</div>
`,
})
export class LoginComponent {
  email = "admin@hrms.dev";
  password = "";
  error = "";
  busy = false;
  constructor(private api: ApiService, private router: Router) {}
  login() {
    if (this.busy) return;
    this.busy = true;
    this.error = "";
    this.api
      .post<any>("/auth/login", { email: this.email, password: this.password })
      .subscribe({
        next: (r) => {
          localStorage.setItem("hrms_token", r.token);
          localStorage.setItem("hrms_role", r.role);
          localStorage.setItem("hrms_email", r.email);
          localStorage.setItem("hrms_name", r.name);
          localStorage.setItem("hrms_employee_id", String(r.employeeId));
          this.router.navigate([['ADMIN','HR_MANAGER'].includes(r.role) ? '/dashboard' : '/settings']);
        },
        error: (e) => {
          this.error = e.error?.message || "Unable to login";
          this.busy = false;
        },
      });
  }
}
