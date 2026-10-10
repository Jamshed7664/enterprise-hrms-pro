import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
<div class="page-head">
    <div>
        <span class="section-label">Time & Attendance</span>
        <h1>Attendance Management</h1>
        <p>Review daily attendance, employee hours and correction requests.</p>
    </div>
    <button class="btn primary" (click)="clockIn()"><app-icon name="clock" /> Clock In</button>
</div>
<div class="kpi-grid">
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="check-circle" /></div>
        <div class="kpi-copy">
            <span>Present</span><strong>{{count('PRESENT')}}</strong><small>On time today</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="clock" /></div>
        <div class="kpi-copy"><span>Late</span><strong>{{count('LATE')}}</strong><small>Late arrivals</small></div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="home" /></div>
        <div class="kpi-copy">
            <span>WFH</span><strong>{{count('WORK_FROM_HOME')}}</strong><small>Remote today</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="alert-circle" /></div>
        <div class="kpi-copy"><span>Absent</span><strong>{{count('ABSENT')}}</strong><small>No attendance</small></div>
    </article>
</div>
<section class="card">
    <div class="card-head">
        <div>
            <span class="section-label">Daily Attendance</span>
            <h2>Today</h2>
        </div>
        <select [(ngModel)]="dept">
            <option value="">All Departments</option>
            <option *ngFor="let d of departments" [value]="d">{{d}}</option>
        </select>
    </div>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let a of filtered">
                    <td><strong>{{a.employee?.firstName}} {{a.employee?.lastName}}</strong></td>
                    <td>{{a.employee?.department?.name}}</td>
                    <td>{{time(a.checkIn)}}</td>
                    <td>{{time(a.checkOut)}}</td>
                    <td>{{hours(a)}}</td>
                    <td><span class="badge" [class.success]="a.status==='PRESENT'">{{a.status}}</span></td>
                    <td>
                        <button class="btn small" *ngIf="a.checkIn&&!a.checkOut" (click)="clockOut(a)">
                            Clock Out
                        </button>
                    </td>
                </tr>
                <tr *ngIf="filtered.length === 0"><td colspan="7"><div class="ui-empty-state">No attendance records available for this selection.</div></td></tr>
            </tbody>
        </table>
    </div>
</section>

`,
})
export class AttendanceComponent implements OnInit {
  rows: any[] = [];
  dept = "";
  id = Number(localStorage.getItem("hrms_employee_id"));
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.api.get<any[]>("/attendance").subscribe((x) => (this.rows = x));
  }
  get departments() {
    return [
      ...new Set(
        this.rows.map((a) => a.employee?.department?.name).filter(Boolean)
      ),
    ];
  }
  get filtered() {
    return this.rows.filter(
      (a) => !this.dept || a.employee?.department?.name === this.dept
    );
  }
  count(s: string) {
    return this.rows.filter((a) => a.status === s).length;
  }
  clockIn() {
    this.api
      .post(`/attendance/clock-in/${this.id}`)
      .subscribe(() => this.load());
  }
  clockOut(a: any) {
    this.api.post(`/attendance/clock-out/${a.id}`).subscribe(() => this.load());
  }
  time(v: string) {
    return v
      ? new Date(v).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
  }
  hours(a: any) {
    if (!a.checkIn || !a.checkOut) return 0;
    return ((+new Date(a.checkOut) - +new Date(a.checkIn)) / 36e5).toFixed(1);
  }
}
