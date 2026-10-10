import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<ng-container *ngIf="e"
   ><div class="page-head">
      <div>
         <span class="section-label">Employee Profile</span>
         <h1>{{e.firstName}} {{e.lastName}}</h1>
         <p>{{e.employeeCode}} · {{e.jobTitle}}</p>
      </div>
      <div><button class="btn" (click)="back()">Back</button></div>
   </div>
   <section class="employee-hero">
      <div class="avatar">{{e.firstName[0]}}{{e.lastName[0]}}</div>
      <div>
         <h2>
            {{e.firstName}} {{e.lastName}}
            <span class="badge success">{{e.status}}</span>
         </h2>
         <p class="muted">{{e.jobTitle}} · {{e.department?.name}}</p>
         <div class="meta-line">
            <span>⌖ {{e.location}}</span><span>✉ {{e.email}}</span
            ><span>☎ {{e.phone||'—'}}</span>
         </div>
      </div>
   </section>
   <div class="grid-3">
      <section class="card">
         <h3>Personal Information</h3>
         <div class="detail-line">
            <span>Date of birth</span><strong>{{e.dateOfBirth||'—'}}</strong>
         </div>
         <div class="detail-line">
            <span>Address</span><strong>{{e.address||e.location}}</strong>
         </div>
         <div class="detail-line">
            <span>Phone</span><strong>{{e.phone||'—'}}</strong>
         </div>
      </section>
      <section class="card">
         <h3>Employment Information</h3>
         <div class="detail-line">
            <span>Join date</span><strong>{{e.joinDate||'—'}}</strong>
         </div>
         <div class="detail-line">
            <span>Manager</span><strong>{{e.managerName||'—'}}</strong>
         </div>
         <div class="detail-line">
            <span>Department</span><strong>{{e.department?.name||'—'}}</strong>
         </div>
      </section>
      <section class="card">
         <h3>Attendance Summary</h3>
         <strong style="font-size: 38px">{{attendance.length}}</strong>
         <p class="muted">
            Attendance records available in the current period.
         </p>
      </section>
   </div>
   <div class="grid-2" style="margin-top: 20px">
      <section class="card">
         <h3>Leave Summary</h3>
         <strong style="font-size: 38px">{{leaves.length}}</strong>
         <p class="muted">Leave request(s) associated with this employee.</p>
      </section>
      <section class="card">
         <h3>Documents</h3>
         <p class="muted">
            Employee documents are available from the Document Center.
         </p>
      </section>
   </div></ng-container
>
`,
})
export class EmployeeDetailComponent implements OnInit {
  e: any;
  attendance: any[] = [];
  leaves: any[] = [];
  id = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}
  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.api.get<any>(`/employees/${this.id}`).subscribe((x) => (this.e = x));
    this.api
      .get<any[]>("/attendance")
      .subscribe(
        (x) => (this.attendance = x.filter((a) => a.employee?.id === this.id))
      );
    this.api
      .get<any[]>("/leaves")
      .subscribe(
        (x) => (this.leaves = x.filter((l) => l.employee?.id === this.id))
      );
  }
  back() {
    this.router.navigate(["/employees"]);
  }
}
