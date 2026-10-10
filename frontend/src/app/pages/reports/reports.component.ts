import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { forkJoin } from "rxjs";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
<div class="page-head">
   <div>
      <span class="section-label">People Analytics</span>
      <h1>Reports & Analytics</h1>
      <p>
         Explore workforce, attendance, leave, payroll, performance and
         recruitment insights.
      </p>
   </div>
   <div>
      <button class="btn" (click)="exportCsv()">▱ Export CSV</button>
      <button class="btn primary" (click)="window.print()"><app-icon name="download" /> Print / Save PDF</button>
   </div>
</div>
<section class="card">
   <div class="toolbar">
      <label>From <input type="date" [(ngModel)]="from" /></label
      ><label>To <input type="date" [(ngModel)]="to" /></label
      ><select [(ngModel)]="department">
         <option value="">All Departments</option>
         <option *ngFor="let d of departments" [value]="d.name">
            {{d.name}}
         </option></select
      ><button class="btn primary">Apply Filters</button>
   </div>
</section>
<div class="kpi-grid" style="margin-top: 18px">
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="users" /></div>
      <div class="kpi-copy">
         <span>Headcount</span><strong>{{filteredEmployees.length}}</strong
         ><small>workforce</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="chart" /></div>
      <div class="kpi-copy">
         <span>Attendance Rate</span><strong>{{attendanceRate}}%</strong
         ><small>selected period</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Leave Approval</span><strong>{{approvalRate}}%</strong
         ><small>decided requests</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="wallet" /></div>
      <div class="kpi-copy">
         <span>Departments</span><strong>{{departments.length}}</strong
         ><small>organization units</small>
      </div>
   </article>
</div>
<div class="grid-2">
   <section class="card">
      <div class="card-head">
         <div>
            <span class="section-label">Headcount Report</span>
            <h2>Department Distribution</h2>
         </div>
      </div>
      <div *ngFor="let d of distribution" class="progress-row">
         <div class="progress-meta">
            <span>{{d.name}}</span><strong>{{d.count}}</strong>
         </div>
         <div class="progress"><i [style.width.%]="d.percent"></i></div>
      </div>
   </section>
   <section class="card">
      <div class="card-head">
         <div>
            <span class="section-label">Report Catalog</span>
            <h2>Available Reports</h2>
         </div>
      </div>
      <div class="report-list">
         <button *ngFor="let r of reportNames"><app-icon name="chart" /> {{r}} <span>›</span></button>
      </div>
   </section>
</div>
`,
})
export class ReportsComponent implements OnInit {
  employees: any[] = [];
  attendance: any[] = [];
  leaves: any[] = [];
  departments: any[] = [];
  department = "";
  from = "2026-01-01";
  to = "2026-12-31";
  window = window;
  reportNames = [
    "Workforce Overview",
    "Headcount",
    "Department",
    "Attendance",
    "Leave",
    "Payroll",
    "Recruitment",
  ];
  constructor(private api: ApiService) {}
  ngOnInit() {
    forkJoin({
      employees: this.api.get<any[]>("/employees"),
      attendance: this.api.get<any[]>("/attendance"),
      leaves: this.api.get<any[]>("/leaves"),
      departments: this.api.get<any[]>("/departments"),
    }).subscribe((x) => Object.assign(this, x));
  }
  get filteredEmployees() {
    return this.employees.filter(
      (e) => !this.department || e.department?.name === this.department
    );
  }
  get attendanceRate() {
    const total = this.attendance.length;
    return total
      ? Math.round(
          (this.attendance.filter((a) => a.status !== "ABSENT").length /
            total) *
            100
        )
      : 0;
  }
  get approvalRate() {
    const decided = this.leaves.filter((l) =>
      ["APPROVED", "REJECTED"].includes(l.status)
    );
    return decided.length
      ? Math.round(
          (decided.filter((l) => l.status === "APPROVED").length /
            decided.length) *
            100
        )
      : 0;
  }
  get distribution() {
    const total = Math.max(this.filteredEmployees.length, 1);
    return this.departments.map((d) => {
      const count = this.filteredEmployees.filter(
        (e) => e.department?.id === d.id
      ).length;
      return {
        name: d.name,
        count,
        percent: Math.max(4, (count / total) * 100),
      };
    });
  }
  exportCsv() {
    const rows = [
      ["Employee Code", "Name", "Email", "Department", "Designation", "Status"],
      ...this.filteredEmployees.map((e) => [
        e.employeeCode,
        `${e.firstName} ${e.lastName}`,
        e.email,
        e.department?.name || "",
        e.jobTitle,
        e.status,
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "hrms-workforce-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
