import { Routes } from "@angular/router";
import { authGuard } from "./core/auth.guard";
import { managerGuard } from "./core/manager.guard";
import { ShellComponent } from "./layout/shell.component";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "dashboard",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "employees",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/employees/employees.component").then(
            (m) => m.EmployeesComponent
          ),
      },
      {
        path: "employees/:id",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/employee-detail/employee-detail.component").then(
            (m) => m.EmployeeDetailComponent
          ),
      },
      {
        path: "organization",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/organization/organization.component").then(
            (m) => m.OrganizationComponent
          ),
      },
      {
        path: "attendance",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/attendance/attendance.component").then(
            (m) => m.AttendanceComponent
          ),
      },
      {
        path: "leave",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/leave/leave.component").then((m) => m.LeaveComponent),
      },
      {
        path: "timesheets",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/timesheets/timesheets.component").then(
            (m) => m.TimesheetsComponent
          ),
      },
      {
        path: "payroll",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/payroll/payroll.component").then(
            (m) => m.PayrollComponent
          ),
      },
      {
        path: "performance",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/performance/performance.component").then(
            (m) => m.PerformanceComponent
          ),
      },
      {
        path: "recruitment",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/recruitment/recruitment.component").then(
            (m) => m.RecruitmentComponent
          ),
      },
      {
        path: "documents",
        loadComponent: () =>
          import("./pages/documents/documents.component").then(
            (m) => m.DocumentsComponent
          ),
      },
      {
        path: "reports",
        canActivate: [managerGuard],
        loadComponent: () =>
          import("./pages/reports/reports.component").then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: "administration",
        loadComponent: () =>
          import("./pages/administration/administration.component").then(
            (m) => m.AdministrationComponent
          ),
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./pages/settings/settings.component").then(
            (m) => m.SettingsComponent
          ),
      },
      { path: "profile", redirectTo: "settings", pathMatch: "full" },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
    ],
  },
  { path: "**", redirectTo: "" },
];
