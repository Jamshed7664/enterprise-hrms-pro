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
      <span class="section-label">Absence</span>
      <h1>Leave Management</h1>
      <p>Track balances, submit leave and manage approval workflows.</p>
   </div>
   <button class="btn primary" (click)="show=true"><app-icon name="calendar" /> Apply Leave</button>
</div>
<div class="kpi-grid">
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="calendar" /></div>
      <div class="kpi-copy">
         <span>Annual Leave</span><strong>14</strong
         ><small>days available</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Sick Leave</span><strong>8</strong><small>days available</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="clock" /></div>
      <div class="kpi-copy">
         <span>Pending</span><strong>{{count('PENDING')}}</strong
         ><small>approval requests</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Approved</span><strong>{{count('APPROVED')}}</strong
         ><small>current period</small>
      </div>
   </article>
</div>
<section class="card">
   <div class="card-head">
      <div>
         <span class="section-label">Requests</span>
         <h2>Leave Requests</h2>
      </div>
      <select [(ngModel)]="filter">
         <option value="">All</option>
         <option>PENDING</option>
         <option>APPROVED</option>
         <option>REJECTED</option>
         <option>CANCELLED</option>
      </select>
   </div>
   <div class="table-wrap">
      <table>
         <thead>
            <tr>
               <th>Employee</th>
               <th>Type</th>
               <th>Dates</th>
               <th>Days</th>
               <th>Status</th>
               <th>Action</th>
            </tr>
         </thead>
         <tbody>
            <tr *ngFor="let l of filtered">
               <td>
                  <strong
                     >{{l.employee?.firstName}} {{l.employee?.lastName}}</strong
                  >
                  <div class="muted">{{l.reason}}</div>
               </td>
               <td>{{l.leaveType}}</td>
               <td>{{l.startDate}} → {{l.endDate}}</td>
               <td>{{days(l)}}</td>
               <td>
                  <span
                     class="badge"
                     [class.success]="l.status==='APPROVED'"
                     [class.danger]="l.status==='REJECTED'"
                     [class.warning]="l.status==='PENDING'"
                     >{{l.status}}</span
                  >
               </td>
               <td>
                  <div *ngIf="l.status==='PENDING'" class="actions">
                     <button (click)="status(l,'APPROVED')">Approve</button
                     ><button (click)="status(l,'REJECTED')">Reject</button>
                  </div>
                  <span class="muted" *ngIf="l.status!=='PENDING'"
                     >{{l.managerComment||'Decision recorded.'}}</span
                  >
               </td>
            </tr>
         </tbody>
      </table>
   </div>
</section>
<div class="modal-backdrop" *ngIf="show">
   <div class="modal">
      <div class="card-head">
         <h3>Apply Leave</h3>
         <button class="x" (click)="show=false">×</button>
      </div>
      <div class="form-grid">
         <label
            >Leave type<select [(ngModel)]="form.leaveType">
               <option>ANNUAL</option>
               <option>SICK</option>
               <option>CASUAL</option>
            </select></label
         ><label
            >Start date<input type="date" [(ngModel)]="form.startDate" /></label
         ><label>End date<input type="date" [(ngModel)]="form.endDate" /></label
         ><label class="full"
            >Reason<textarea [(ngModel)]="form.reason"></textarea>
         </label>
      </div>
      <div class="modal-actions">
         <button class="btn" (click)="show=false">Cancel</button
         ><button class="btn primary" (click)="save()">Submit Request</button>
      </div>
   </div>
</div>
`,
})
export class LeaveComponent implements OnInit {
  rows: any[] = [];
  filter = "";
  show = false;
  form: any = { leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" };
  id = Number(localStorage.getItem("hrms_employee_id"));
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.api.get<any[]>("/leaves").subscribe((x) => (this.rows = x));
  }
  get filtered() {
    return this.rows.filter((x) => !this.filter || x.status === this.filter);
  }
  count(s: string) {
    return this.rows.filter((x) => x.status === s).length;
  }
  days(l: any) {
    return (
      Math.floor((+new Date(l.endDate) - +new Date(l.startDate)) / 86400000) + 1
    );
  }
  save() {
    this.api
      .post("/leaves", { ...this.form, employeeId: this.id })
      .subscribe(() => {
        this.show = false;
        this.load();
      });
  }
  status(l: any, s: string) {
    this.api
      .patch(
        `/leaves/${l.id}/status?value=${s}&comment=${encodeURIComponent(
          s === "APPROVED"
            ? "Approved by HR Manager."
            : "Not approved in HR workflow."
        )}`
      )
      .subscribe(() => this.load());
  }
}
