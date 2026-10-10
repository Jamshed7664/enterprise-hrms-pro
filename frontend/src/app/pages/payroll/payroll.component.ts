import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../core/api.service";
@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
<div class="page-head">
   <div>
      <span class="section-label">Compensation</span>
      <h1>Payroll Overview</h1>
      <p>
         Review salary components, deductions, net pay and processing status.
      </p>
   </div>
</div>
<div class="kpi-grid">
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="wallet" /></div>
      <div class="kpi-copy">
         <span>Net Payroll</span
         ><strong>₹{{sum('netSalary')|number:'1.0-0'}}</strong
         ><small>selected month</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="plus" /></div>
      <div class="kpi-copy">
         <span>Allowances</span
         ><strong>₹{{sum('allowances')|number:'1.0-0'}}</strong
         ><small>total</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="chart" /></div>
      <div class="kpi-copy">
         <span>Deductions</span
         ><strong>₹{{sum('deductions')|number:'1.0-0'}}</strong
         ><small>total</small>
      </div>
   </article>
   <article class="kpi">
      <div class="kpi-icon"><app-icon name="check-circle" /></div>
      <div class="kpi-copy">
         <span>Processed</span><strong>{{processed}}</strong
         ><small>employee records</small>
      </div>
   </article>
</div>
<p class="error" *ngIf="error">{{error}}</p>
<section class="card">
   <div class="card-head">
      <div>
         <span class="section-label">Payroll</span>
         <h2>Employee Payroll</h2>
      </div>
   </div>
   <div class="table-wrap">
      <table>
         <thead>
            <tr>
               <th>Employee</th>
               <th>Basic</th>
               <th>Allowances</th>
               <th>Deductions</th>
               <th>Net Pay</th>
               <th>Status</th>
               <th>Action</th>
            </tr>
         </thead>
         <tbody>
            <tr *ngFor="let p of rows">
               <td>
                  <strong
                     >{{p.employee?.firstName}} {{p.employee?.lastName}}</strong
                  >
               </td>
               <td>₹{{p.basicSalary|number:'1.0-0'}}</td>
               <td>₹{{p.allowances|number:'1.0-0'}}</td>
               <td>₹{{p.deductions|number:'1.0-0'}}</td>
               <td><strong>₹{{p.netSalary|number:'1.0-0'}}</strong></td>
               <td>
                  <span class="badge" [class.success]="p.status==='PAID'"
                     >{{p.status}}</span
                  >
               </td>
               <td>
                  <button class="btn small" (click)="action(p)">
                     {{p.status==='PAID'?'Payslip CSV':'Mark Paid'}}
                  </button>
               </td>
            </tr>
         </tbody>
      </table>
   </div>
</section>
<div class="notice" style="margin-top: 20px">
   <strong>Payroll module</strong>
   <div>
      Salary records are loaded from the Spring Boot backend. Extend this module
      with statutory calculations and payment integrations when needed.
   </div>
</div>
`,
})
export class PayrollComponent implements OnInit {
  rows: any[] = [];
  error = '';
  action(p:any) {
    this.error='';
    if(p.status!=='PAID') { if(!confirm('Mark this payroll record as paid?'))return;this.api.patch(`/payroll/${p.id}/pay`).subscribe({next:()=>this.ngOnInit(),error:e=>this.error=ApiService.errorMessage(e)});return; }
    this.api.blob(`/payroll/${p.id}/payslip`).subscribe({next:b=>{const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`payslip-${p.id}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)},error:e=>this.error=ApiService.errorMessage(e)});
  }
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any[]>("/payroll").subscribe((x) => (this.rows = x));
  }
  sum(k: string) {
    return this.rows.reduce((s, x) => s + (Number(x[k]) || 0), 0);
  }
  get processed() {
    return this.rows.filter((x) => ["PAID", "PROCESSED"].includes(x.status))
      .length;
  }
}
