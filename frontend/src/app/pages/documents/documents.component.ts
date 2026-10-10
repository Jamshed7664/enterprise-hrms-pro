import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
@Component({ standalone: true, imports: [CommonModule, FormsModule], template: `
<div class="page-head"><div><span class="section-label">Employee Records</span><h1>Document Center</h1><p>Secure, authenticated document storage and expiry tracking.</p></div></div>
<section class="card" *ngIf="canManage">
 <h2>Upload Employee Document</h2>
 <div class="form-grid">
 <label>Employee<select [(ngModel)]="employeeId"><option *ngFor="let e of employees" [ngValue]="e.id">{{e.firstName}} {{e.lastName}}</option></select></label>
 <label>Category<select [(ngModel)]="category"><option>Identity</option><option>Contract</option><option>Certification</option><option>Compliance</option><option>Other</option></select></label>
 <label>Expiry date (optional)<input type="date" [(ngModel)]="expiry" /></label>
 <label>Select PDF / JPG / PNG (max 5MB)<input type="file" accept=".pdf,.png,.jpg,.jpeg" (change)="upload($event)" [disabled]="busy || !employeeId" /></label>
 </div>
</section>
<p class="error" *ngIf="error">{{error}}</p><p class="notice" *ngIf="message">{{message}}</p>
<div class="kpi-grid"><article class="kpi"><div class="kpi-copy"><span>Total documents</span><strong>{{docs.length}}</strong></div></article>
<article class="kpi"><div class="kpi-copy"><span>Valid</span><strong>{{count('Valid')}}</strong></div></article>
<article class="kpi"><div class="kpi-copy"><span>Expiring</span><strong>{{count('Expiring')}}</strong></div></article>
<article class="kpi"><div class="kpi-copy"><span>Expired</span><strong>{{count('Expired')}}</strong></div></article></div>
<section class="card"><div class="toolbar"><input class="search" placeholder="Search documents..." [(ngModel)]="q" />
<select [(ngModel)]="filter"><option value="">All</option><option>Valid</option><option>Expiring</option><option>Expired</option></select></div>
<div class="table-wrap"><table><thead><tr><th>Document</th><th>Employee</th><th>Category</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
<tbody><tr *ngFor="let d of filtered"><td>{{d.name}}</td><td>{{d.employee}}</td><td>{{d.category}}</td><td>{{d.expiry || '—'}}</td><td><span class="badge" [class.success]="d.status==='Valid'" [class.warning]="d.status==='Expiring'" [class.danger]="d.status==='Expired'">{{d.status}}</span></td>
<td class="actions"><button (click)="download(d)">⇩ Download</button><button *ngIf="canManage" (click)="remove(d)">× Delete</button></td></tr>
<tr *ngIf="!filtered.length"><td colspan="6">No documents found.</td></tr></tbody></table></div></section>
` })
export class DocumentsComponent implements OnInit {
 docs: any[] = []; employees: any[] = []; employeeId = Number(localStorage.getItem('hrms_employee_id')) || 0;
 category='Other'; expiry=''; q=''; filter=''; busy=false; error=''; message='';
 canManage=['ADMIN','HR_MANAGER'].includes(localStorage.getItem('hrms_role') || '');
 constructor(private api:ApiService) {}
 ngOnInit() { this.load(); if(this.canManage) this.api.get<any[]>('/employees').subscribe({next:r=>{this.employees=r;if(!this.employeeId&&r.length)this.employeeId=r[0].id},error:e=>this.error=ApiService.errorMessage(e)}); }
 load(){this.api.get<any[]>('/documents').subscribe({next:r=>this.docs=r,error:e=>this.error=ApiService.errorMessage(e)});}
 get filtered(){const q=this.q.toLowerCase();return this.docs.filter(d=>(!this.filter||d.status===this.filter)&&`${d.name} ${d.employee} ${d.category}`.toLowerCase().includes(q));}
 count(s:string){return this.docs.filter(d=>d.status===s).length;}
 upload(event:Event){const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;this.busy=true;this.error='';this.message='';
 this.api.uploadDocument(file,this.employeeId,this.category,this.expiry).subscribe({next:()=>{input.value='';this.busy=false;this.message='Document uploaded';this.load()},error:e=>{this.busy=false;this.error=ApiService.errorMessage(e)}});
 }
 download(d:any){this.error='';this.api.blob(`/documents/${d.id}/download`).subscribe({next:b=>{const url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download=d.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},error:e=>this.error=ApiService.errorMessage(e)});}
 remove(d:any){if(!confirm(`Delete ${d.name}?`))return;this.api.delete(`/documents/${d.id}`).subscribe({next:()=>{this.message='Document removed';this.load()},error:e=>this.error=ApiService.errorMessage(e)});}
}
