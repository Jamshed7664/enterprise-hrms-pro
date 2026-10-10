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
      <span class="section-label">Organization</span>
      <h1>Departments & Structure</h1>
      <p>
         Manage departments, leadership, office locations and reporting
         structure.
      </p>
   </div>
   <button class="btn primary" (click)="newDepartment()"><app-icon name="plus" /> New Department</button>
</div>
<div class="dept-grid">
   <section class="card dept-card" *ngFor="let d of departments">
      <div class="dept-code">{{d.code||abbr(d.name)}}</div>
      <h2>{{d.name}}</h2>
      <p class="muted">{{locationFor(d.name)}}</p>
      <div class="detail-line">
         <span>Department Head</span><strong>{{headFor(d.name)}}</strong>
      </div>
      <div class="detail-line">
         <span>Employees</span><strong>{{countFor(d.id)}}</strong>
      </div><div class="modal-actions"><button class="btn small" (click)="edit(d)">Edit Department</button></div>
   </section>
</div>
<div class="modal-backdrop" *ngIf="show">
   <div class="modal">
      <div class="card-head">
         <h3>{{form.id ? 'Edit Department' : 'New Department'}}</h3>
         <button class="x" (click)="show=false">×</button>
      </div>
      <div class="form-grid">
         <label>Name<input [(ngModel)]="form.name" /></label
         ><label>Code<input [(ngModel)]="form.code" /></label
         ><label class="full"
            >Description<textarea [(ngModel)]="form.description"></textarea>
         </label>
      </div>
      <div class="modal-actions">
         <button class="btn" (click)="show=false">Cancel</button
         ><button class="btn primary" (click)="save()">
            {{form.id ? 'Save Changes' : 'Create Department'}}
         </button>
      </div>
   </div>
</div>
`,
})
export class OrganizationComponent implements OnInit {
  departments: any[] = [];
  employees: any[] = [];
  show = false;
  form: any = { name: "", code: "", description: "", active: true };
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.load();
  }
  load() {
    forkJoin({
      departments: this.api.get<any[]>("/departments"),
      employees: this.api.get<any[]>("/employees"),
    }).subscribe((x) => {
      this.departments = x.departments;
      this.employees = x.employees;
    });
  }
  newDepartment() { this.form = {name:'',code:'',description:'',active:true}; this.show=true; }
  edit(d:any) { this.form={...d};this.show=true; }
  save() {
    const request = this.form.id ? this.api.put(`/departments/${this.form.id}`, this.form) : this.api.post('/departments', this.form);
    request.subscribe(() => {
      this.show = false;
      this.form = { name: "", code: "", description: "", active: true };
      this.load();
    });
  }
  countFor(id: number) {
    return this.employees.filter((e) => e.department?.id === id).length;
  }
  abbr(n: string) {
    return n
      .split(/\s+/)
      .map((x) => x[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }
  headFor(n: string) {
    return (
      this.employees.find((e) => e.department?.name === n)?.managerName ||
      this.employees.find((e) => e.department?.name === n)?.firstName +
        " " +
        (this.employees.find((e) => e.department?.name === n)?.lastName ||
          "") ||
      "Not assigned"
    );
  }
  locationFor(n: string) {
    return (
      this.employees.find((e) => e.department?.name === n)?.location ||
      "Head Office"
    );
  }
}
