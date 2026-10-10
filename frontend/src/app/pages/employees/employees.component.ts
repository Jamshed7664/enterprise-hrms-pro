import { ToastService } from '../../core/toast.service';
import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `<div class="page-head">
   <div>
      <span class="section-label">People</span>
      <h1>Employee Directory</h1>
      <p>Manage employee profiles, employment details and workforce status.</p>
   </div>
   <button class="btn primary" (click)="openNew()"><app-icon name="user-plus" /> Add Employee</button>
</div>
<section class="card">
   <div class="toolbar">
      <div class="search-field"><app-icon name="search" />
      <input class="search" placeholder="Search name, email, code or department..." [(ngModel)]="q" />
      </div><select [(ngModel)]="departmentFilter">
         <option value="">All</option>
         <option *ngFor="let d of departments" [value]="d.name">
            {{d.name}}
         </option>
      </select>
   </div>
   <div class="table-wrap">
      <table>
         <thead>
            <tr>
               <th>Employee</th>
               <th>Department</th>
               <th>Designation</th>
               <th>Location</th>
               <th>Status</th>
               <th>Actions</th>
            </tr>
         </thead>
         <tbody>
            <tr *ngFor="let e of filtered">
               <td>
                  <div class="person">
                     <div class="avatar">
                        {{e.firstName[0]}}{{e.lastName[0]}}
                     </div>
                     <div class="person-meta">
                        <strong>{{e.firstName}} {{e.lastName}}</strong
                        ><small>{{e.employeeCode}} · {{e.email}}</small>
                     </div>
                  </div>
               </td>
               <td>{{e.department?.name||'—'}}</td>
               <td>{{e.jobTitle}}</td>
               <td>{{e.location}}</td>
               <td>
                  <span class="badge" [class.success]="e.status==='ACTIVE'"
                     >{{labelStatus(e.status)}}</span
                  >
               </td>
               <td class="actions">
                  <button title="View employee" (click)="view(e)"><app-icon name="eye" /></button
                  ><button title="Edit employee" (click)="edit(e)"><app-icon name="edit" /></button
                  ><button title="Toggle employee status" (click)="toggle(e)"><app-icon name="refresh" /></button
                  ><button title="Delete employee" (click)="remove(e)"><app-icon name="trash" /></button>
               </td>
            </tr>
            <tr *ngIf="filtered.length === 0"><td colspan="6"><div class="ui-empty-state"><app-icon name="users" /> No matching employees found. Try a different search or department.</div></td></tr>
         </tbody>
      </table>
   </div>
</section>
<div class="modal-backdrop" *ngIf="show">
   <div class="modal">
      <div class="card-head">
         <h3>{{form.id?'Edit':'Add'}} Employee</h3>
         <button class="x" (click)="show=false">×</button>
      </div>
      <div class="form-grid">
         <label>Employee code<input [(ngModel)]="form.employeeCode" /></label
         ><label>First name<input [(ngModel)]="form.firstName" /></label
         ><label>Last name<input [(ngModel)]="form.lastName" /></label
         ><label>Email<input [(ngModel)]="form.email" /></label
         ><label>Phone<input [(ngModel)]="form.phone" /></label
         ><label>Designation<input [(ngModel)]="form.jobTitle" /></label
         ><label>Location<input [(ngModel)]="form.location" /></label
         ><label
            >Department<select [(ngModel)]="form.departmentId">
               <option [ngValue]="null">Select department</option>
               <option *ngFor="let d of departments" [ngValue]="d.id">
                  {{d.name}}
               </option>
            </select></label
         ><label
            >Join date<input type="date" [(ngModel)]="form.joinDate" /></label
         ><label>Manager<input [(ngModel)]="form.managerName" /></label
         ><label class="full"
            >Address<textarea [(ngModel)]="form.address"></textarea>
         </label>
      </div>
      <p class="error" *ngIf="error">{{error}}</p>
      <div class="modal-actions">
         <button class="btn" (click)="show=false">Cancel</button
         ><button class="btn primary" (click)="save()">Save Employee</button>
      </div>
   </div>
</div>
`,
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  departments: any[] = [];
  q = "";
  departmentFilter = "";
  show = false;
  error = "";
  form: any = {};
  constructor(private api: ApiService, private router: Router, private toast: ToastService) {}
  ngOnInit() {
    this.load();
    this.api
      .get<any[]>("/departments")
      .subscribe((x) => (this.departments = x));
  }
  get filtered() {
    const q = this.q.toLowerCase();
    return this.employees.filter(
      (e) =>
        (!this.departmentFilter ||
          e.department?.name === this.departmentFilter) &&
        `${e.firstName} ${e.lastName} ${e.email} ${e.employeeCode} ${
          e.department?.name || ""
        }`
          .toLowerCase()
          .includes(q)
    );
  }
  load() {
    this.api.get<any[]>("/employees").subscribe((x) => (this.employees = x));
  }
  view(e: any) {
    this.router.navigate(["/employees", e.id]);
  }
  openNew() {
    this.form = {
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      location: "",
      joinDate: new Date().toISOString().slice(0, 10),
      departmentId: null,
      status: "ACTIVE",
      managerName: "",
      address: "",
    };
    this.show = true;
  }
  edit(e: any) {
    this.form = { ...e, departmentId: e.department?.id };
    this.show = true;
  }
  save() {
    if (!this.form.firstName?.trim() || !this.form.lastName?.trim() || !this.form.email?.trim() || !this.form.employeeCode?.trim()) {
      this.error = 'Employee code, name and email are required.';
      this.toast.warning(this.error, 'Missing information');
      return;
    }
    this.error = "";
    const req = this.form.id
      ? this.api.put<any>(`/employees/${this.form.id}`, this.form)
      : this.api.post<any>("/employees", this.form);
    req.subscribe({
      next: () => {
        this.show = false;
        this.load();
      },
      error: (e) =>
        (this.error = e.error?.message || "Unable to save employee"),
    });
  }
  toggle(e: any) {
    this.api
      .patch(
        `/employees/${e.id}/status?value=${
          e.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        }`
      )
      .subscribe(() => this.load());
  }
  remove(e: any) {
    if (confirm(`Delete ${e.firstName} ${e.lastName}?`))
      this.api.delete(`/employees/${e.id}`).subscribe(() => this.load());
  }
  labelStatus(s: string) {
    return s === "ACTIVE" ? "Active" : s === "ON_LEAVE" ? "On Leave" : s || "—";
  }
}
