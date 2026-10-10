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
      <span class="section-label">Applicant Tracking</span>
      <h1>Recruitment</h1>
      <p>Manage openings, candidates, interviews and the hiring pipeline.</p>
   </div>
   <button class="btn primary" (click)="show=true"><app-icon name="user-plus" /> New Candidate</button>
</div>
<div class="kpi-grid">
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="briefcase" /></div>
      <div class="kpi-copy">
         <span>Open Jobs</span><strong>{{positions.length}}</strong
         ><small>active roles</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="users" /></div>
      <div class="kpi-copy">
         <span>Applicants</span><strong>{{rows.length}}</strong
         ><small>across openings</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Interviews</span><strong>{{stageCount('INTERVIEW')}}</strong
         ><small>in pipeline</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="edit" /></div>
      <div class="kpi-copy">
         <span>Offers</span><strong>{{stageCount('OFFER')}}</strong
         ><small>awaiting decision</small>
      </div>
   </article>
</div>
<section class="card">
   <div class="card-head">
      <div>
         <span class="section-label">Open Positions</span>
         <h2>Job Openings</h2>
      </div>
   </div>
   <div class="grid-3">
      <div class="summary-box" *ngFor="let p of positions">
         <strong>{{p}}</strong
         ><span>{{rowsForPosition(p).length}} applicant(s)</span>
      </div>
   </div>
</section>
<section class="card" style="margin-top: 20px">
   <div class="card-head">
      <div>
         <span class="section-label">Candidate Pipeline</span>
         <h2>Applicant Tracking Board</h2>
      </div>
      <span class="muted">Move candidates with the stage selector</span>
   </div>
   <div class="kanban">
      <div class="lane" *ngFor="let s of stages">
         <div class="lane-head">
            <span>{{s.label}}</span
            ><span class="badge">{{stageRows(s.value).length}}</span>
         </div>
         <div class="candidate" *ngFor="let c of stageRows(s.value)">
            <h4>{{c.name}}</h4>
            <p>{{c.position}}</p>
            <small>{{c.experienceYears||0}} yrs · {{c.source||'Direct'}}</small
            ><select [(ngModel)]="c.stage" (change)="move(c)">
               <option *ngFor="let x of stages" [value]="x.value">
                  {{x.label}}
               </option></select
            ><button class="btn small danger" (click)="remove(c)">
               Remove
            </button>
         </div>
      </div>
   </div>
</section>
<div class="modal-backdrop" *ngIf="show">
   <div class="modal">
      <div class="card-head">
         <h3>Add Candidate</h3>
         <button class="x" (click)="show=false">×</button>
      </div>
      <div class="form-grid">
         <label>Name<input [(ngModel)]="form.name" /></label
         ><label>Email<input [(ngModel)]="form.email" /></label
         ><label>Phone<input [(ngModel)]="form.phone" /></label
         ><label>Position<input [(ngModel)]="form.position" /></label
         ><label
            >Experience years<input
               type="number"
               [(ngModel)]="form.experienceYears" /></label
         ><label>Source<input [(ngModel)]="form.source" /></label>
      </div>
      <div class="modal-actions">
         <button class="btn" (click)="show=false">Cancel</button
         ><button class="btn primary" (click)="save()">Add Candidate</button>
      </div>
   </div>
</div>
`,
})
export class RecruitmentComponent implements OnInit {
  rows: any[] = [];
  show = false;
  form: any = { stage: "APPLIED" };
  stages = [
    { label: "Applied", value: "APPLIED" },
    { label: "Screening", value: "SCREENING" },
    { label: "Interview", value: "INTERVIEW" },
    { label: "Offer", value: "OFFER" },
    { label: "Hired", value: "HIRED" },
  ];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    this.api.get<any[]>("/candidates").subscribe((x) => (this.rows = x));
  }
  get positions() {
    return [...new Set(this.rows.map((x) => x.position).filter(Boolean))];
  }
  rowsForPosition(p: string) {
    return this.rows.filter((x) => x.position === p);
  }
  stageRows(s: string) {
    return this.rows.filter((x) => x.stage === s);
  }
  stageCount(s: string) {
    return this.stageRows(s).length;
  }
  move(c: any) {
    this.api
      .patch(`/candidates/${c.id}/stage?value=${c.stage}`)
      .subscribe(() => this.load());
  }
  remove(c: any) {
    if (confirm(`Remove ${c.name}?`))
      this.api.delete(`/candidates/${c.id}`).subscribe(() => this.load());
  }
  save() {
    this.api.post("/candidates", this.form).subscribe(() => {
      this.show = false;
      this.form = { stage: "APPLIED" };
      this.load();
    });
  }
}
