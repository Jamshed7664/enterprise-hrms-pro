import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
@Component({standalone:true,imports:[CommonModule,FormsModule, IconComponent],template:`
<div class="page-head"><div><span class="section-label">System</span><h1>Administration</h1><p>Manage actual application users, roles, approval flags and activity logs.</p></div><button class="btn primary" (click)="show=!show"><app-icon name="user-plus" /> Add User</button></div>
<p class="error" *ngIf="error">{{error}}</p><div class="notice" *ngIf="message">{{message}}</div>
<section class="card" *ngIf="show"><h2>Create Login Account</h2><div class="form-grid">
<label>Email<input type="email" [(ngModel)]="form.email" /></label><label>Temporary password (12+ characters)<input type="password" [(ngModel)]="form.password" /></label>
<label>Role<select [(ngModel)]="form.role"><option>ADMIN</option><option>HR_MANAGER</option><option>EMPLOYEE</option></select></label>
<label>Linked employee (optional)<select [(ngModel)]="form.employeeId"><option [ngValue]="null">No linked employee</option><option *ngFor="let e of employees" [ngValue]="e.id">{{e.firstName}} {{e.lastName}}</option></select></label></div>
<div class="modal-actions"><button class="btn" (click)="show=false">Cancel</button><button class="btn primary" (click)="add()">Create user</button></div></section>
<section class="card"><div class="card-head"><h2>User Accounts</h2></div><div class="table-wrap"><table><thead><tr><th>Email</th><th>Role</th><th>Employee ID</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr *ngFor="let u of users"><td>{{u.email}}</td><td><select [(ngModel)]="u.role" [disabled]="isMe(u)"><option>ADMIN</option><option>HR_MANAGER</option><option>EMPLOYEE</option></select></td><td>{{u.employeeId || '—'}}</td><td>{{u.enabled?'Enabled':'Disabled'}}</td>
<td class="actions"><button (click)="save(u)" [disabled]="isMe(u)">Save role</button><button (click)="toggle(u)" [disabled]="isMe(u)">{{u.enabled?'Disable':'Enable'}}</button></td></tr></tbody></table></div></section>
<div class="grid-2" style="margin-top:20px"><section class="card"><h2>Permissions by role</h2><div class="detail-line"><strong>ADMIN</strong><span>All modules + user administration</span></div><div class="detail-line"><strong>HR_MANAGER</strong><span>HR operations and management</span></div><div class="detail-line"><strong>EMPLOYEE</strong><span>Own profile and documents</span></div></section>
<section class="card"><h2>Approval configuration</h2><div class="detail-line" *ngFor="let r of rules"><div><strong>{{r.name}}</strong><p class="muted">{{r.flow}}</p></div><input type="checkbox" style="width:auto" [(ngModel)]="r.enabled" (change)="saveRule(r)" /></div><small class="muted">Rules are saved as administrative flags; workflow enforcement must be configured separately.</small></section></div>
<section class="card" style="margin-top:20px"><h2>Audit history (most recent 100)</h2><div class="table-wrap"><table><thead><tr><th>Time</th><th>Actor</th><th>Module</th><th>Action</th><th>Details</th></tr></thead><tbody><tr *ngFor="let a of audit"><td>{{a.time}}</td><td>{{a.actor}}</td><td>{{a.module}}</td><td>{{a.action}}</td><td>{{a.details}}</td></tr></tbody></table></div></section>`})
export class AdministrationComponent implements OnInit {
 users:any[]=[];employees:any[]=[];rules:any[]=[];audit:any[]=[];show=false;error='';message='';
 form:any={email:'',password:'',role:'EMPLOYEE',employeeId:null};
 constructor(private api:ApiService){} ngOnInit(){this.load();this.api.get<any[]>('/employees').subscribe({next:v=>this.employees=v,error:e=>this.fail(e)});}
 load(){this.api.get<any[]>('/admin/users').subscribe({next:v=>this.users=v,error:e=>this.fail(e)});this.api.get<any[]>('/admin/rules').subscribe({next:v=>this.rules=v,error:e=>this.fail(e)});this.api.get<any[]>('/admin/audit').subscribe({next:v=>this.audit=v,error:e=>this.fail(e)});}
 fail(e:any){this.error=ApiService.errorMessage(e);} isMe(u:any){return u.email===localStorage.getItem('hrms_email');}
 add(){this.error='';this.api.post('/admin/users',this.form).subscribe({next:()=>{this.message='User created';this.show=false;this.form={email:'',password:'',role:'EMPLOYEE',employeeId:null};this.load()},error:e=>this.fail(e)});}
 save(u:any){this.api.patch(`/admin/users/${u.id}`,{role:u.role}).subscribe({next:()=>{this.message='Role saved';this.load()},error:e=>this.fail(e)});}
 toggle(u:any){this.api.patch(`/admin/users/${u.id}`,{enabled:!u.enabled}).subscribe({next:()=>{this.message='User status updated';this.load()},error:e=>this.fail(e)});}
 saveRule(r:any){this.api.put(`/admin/rules/${r.id}`,{enabled:r.enabled}).subscribe({next:()=>this.message='Approval flag saved',error:e=>this.fail(e)});}
}
