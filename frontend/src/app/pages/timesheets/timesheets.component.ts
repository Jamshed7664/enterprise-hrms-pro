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
      <span class="section-label">Time Tracking</span>
      <h1>Timesheets</h1>
      <p>
         Submit weekly hours, review project allocation and manage approvals.
      </p>
   </div>
   <button class="btn primary" (click)="show=true"><app-icon name="plus" /> New Timesheet</button>
</div>
<div class="kpi-grid">
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="clock" /></div>
      <div class="kpi-copy">
         <span>Total Hours</span><strong>{{totalHours|number:'1.0-1'}}</strong
         ><small>recorded</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Approved</span><strong>{{count('APPROVED')}}</strong
         ><small>timesheets</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="clock" /></div>
      <div class="kpi-copy">
         <span>Submitted</span><strong>{{count('SUBMITTED')}}</strong
         ><small>awaiting review</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="edit" /></div>
      <div class="kpi-copy">
         <span>Draft</span><strong>{{count('DRAFT')}}</strong
         ><small>not submitted</small>
      </div>
   </article>
</div>
<section class="card">
   <div class="card-head">
      <div>
         <span class="section-label">Weekly Timesheets</span>
         <h2>Time Entries</h2>
      </div>
   </div>
   <div class="table-wrap">
      <table>
         <thead>
            <tr>
               <th>Employee</th>
               <th>Week Start</th>
               <th>Project</th>
               <th>Hours</th>
               <th>Status</th>
               <th>Actions</th>
            </tr>
         </thead>
         <tbody>
            <tr *ngFor="let t of rows">
               <td>
                  <strong
                     >{{t.employee?.firstName}} {{t.employee?.lastName}}</strong
                  >
               </td>
               <td>{{t.weekStart}}</td>
               <td>{{t.projectName}}</td>
               <td>{{t.hours}}</td>
               <td>
                  <span
                     class="badge"
                     [class.success]="t.status==='APPROVED'"
                     [class.warning]="t.status==='SUBMITTED'"
                     >{{t.status}}</span
                  >
               </td>
               <td class="actions">
                  <button
                     *ngIf="t.status==='DRAFT'"
                     (click)="status(t,'SUBMITTED')"
                  >
                     Submit</button
                  ><button
                     *ngIf="t.status==='SUBMITTED'"
                     (click)="status(t,'APPROVED')"
                  >
                     Approve</button
                  ><button
                     *ngIf="t.status==='SUBMITTED'"
                     (click)="status(t,'REJECTED')"
                  >
                     Reject
                  </button>
               </td>
            </tr>
         </tbody>
      </table>
   </div>
</section>
<div class="modal-backdrop" *ngIf="show">
   <div class="modal">
      <div class="card-head">
         <h3>New Timesheet</h3>
         <button class="x" (click)="show=false">×</button>
      </div>
      <div class="form-grid">
         <label
            >Week start<input type="date" [(ngModel)]="form.weekStart" /></label
         ><label>Hours<input type="number" [(ngModel)]="form.hours" /></label
         ><label class="full"
            >Project<input [(ngModel)]="form.projectName" /></label
         ><label class="full"
            >Notes<textarea [(ngModel)]="form.notes"></textarea>
         </label>
      </div>
      <div class="modal-actions">
         <button class="btn" (click)="show=false">Cancel</button
         ><button class="btn primary" (click)="save()">Save Draft</button>
      </div>
   </div>
</div>
`,
})
export class TimesheetsComponent implements OnInit {
  rows: any[] = [];
  show = false;
  id = Number(localStorage.getItem("hrms_employee_id"));
  form: any = {
    weekStart: new Date().toISOString().slice(0, 10),
    hours: 40,
    projectName: "",
    notes: "",
  };
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.api.get<any[]>("/timesheets").subscribe((x) => (this.rows = x));
  }
  get totalHours() {
    return this.rows.reduce((s, x) => s + (Number(x.hours) || 0), 0);
  }
  count(s: string) {
    return this.rows.filter((x) => x.status === s).length;
  }
  save() {
    this.api
      .post("/timesheets", { ...this.form, employeeId: this.id })
      .subscribe(() => {
        this.show = false;
        this.load();
      });
  }
  status(t: any, s: string) {
    this.api
      .patch(`/timesheets/${t.id}/status?value=${s}`)
      .subscribe(() => this.load());
  }
}
