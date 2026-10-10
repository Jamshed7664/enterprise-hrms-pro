import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ThemeService } from '../../core/theme.service';
@Component({standalone:true,imports:[CommonModule,FormsModule, IconComponent],template:`
<div class="page-head"><div><span class="section-label">Preferences</span><h1>Settings & Self Service</h1><p>Your profile, company preferences, appearance, notifications and account security.</p></div></div>
<p class="error" *ngIf="error">{{error}}</p><p class="notice" *ngIf="message">{{message}}</p>
<div class="settings-layout"><aside class="settings-nav"><button [class.active]="tab==='profile'" (click)="tab='profile'"><app-icon name="user" /> My Profile</button><button *ngIf="manager" [class.active]="tab==='company'" (click)="tab='company'"><app-icon name="building" /> Company</button><button [class.active]="tab==='appearance'" (click)="tab='appearance'"><app-icon name="sun" /> Appearance</button><button [class.active]="tab==='notifications'" (click)="tab='notifications'"><app-icon name="bell" /> Notifications</button><button [class.active]="tab==='security'" (click)="tab='security'"><app-icon name="shield" /> Security</button></aside>
<section class="card" *ngIf="tab==='profile' && p"><h2>My Profile</h2>
<div style="display:flex;align-items:center;gap:20px;margin-bottom:20px"><div class="profile-photo"><img *ngIf="imageUrl" [src]="imageUrl" style="width:100%;height:100%;object-fit:cover"><strong *ngIf="!imageUrl">{{p.firstName?.[0]}}{{p.lastName?.[0]}}</strong></div><label class="btn">Upload Photo<input type="file" hidden accept=".jpg,.jpeg,.png" (change)="upload($event)" /></label></div>
<div class="form-grid"><label>First Name<input [(ngModel)]="p.firstName" [disabled]="!manager" /></label><label>Last Name<input [(ngModel)]="p.lastName" [disabled]="!manager" /></label><label>Email<input [(ngModel)]="p.email" [disabled]="!manager" /></label><label>Phone<input [(ngModel)]="p.phone" /></label><label>Role<input [value]="role" disabled /></label><label>Location<input [(ngModel)]="p.location" /></label><label class="full">Address<textarea [(ngModel)]="p.address"></textarea></label></div>
<div class="modal-actions"><button class="btn primary" (click)="saveProfile()">Save Profile</button></div></section>
<section class="card" *ngIf="tab==='company' && manager"><h2>Company Preferences</h2><div class="form-grid"><label>Company name<input [(ngModel)]="company.companyName" /></label><label>Workspace<input [(ngModel)]="company.workspace" /></label><label>Timezone<input [(ngModel)]="company.timezone" /></label><label>Locale<input [(ngModel)]="company.locale" /></label></div><div class="modal-actions"><button class="btn primary" (click)="saveCompany()">Save Company Preferences</button></div></section>
<section class="card" *ngIf="tab==='appearance'"><h2>Appearance</h2><p class="muted">Your theme preference is stored on this device.</p><button class="btn primary" (click)="theme.toggle()">{{theme.dark()?'Switch to Light':'Switch to Dark'}}</button></section>
<section class="card" *ngIf="tab==='notifications'"><h2>Notification Preferences</h2><div class="detail-line"><span>Leave approval alerts</span><input type="checkbox" [(ngModel)]="notifications.leaveAlerts" /></div><div class="detail-line"><span>Attendance exceptions</span><input type="checkbox" [(ngModel)]="notifications.attendanceAlerts" /></div><div class="detail-line"><span>Recruitment updates</span><input type="checkbox" [(ngModel)]="notifications.recruitmentAlerts" /></div><button class="btn primary" (click)="saveNotifications()">Save Preferences</button><p class="muted">These preferences are persisted. Automated email/push delivery is not included.</p></section>
<section class="card" *ngIf="tab==='security'"><h2>Change Password</h2><div class="form-grid"><label>Current password<input type="password" [(ngModel)]="currentPassword" /></label><label>New password (12+ characters)<input type="password" [(ngModel)]="newPassword" /></label></div><div class="modal-actions"><button class="btn primary" (click)="changePassword()">Update Password</button></div></section>
</div>`})
export class SettingsComponent implements OnInit,OnDestroy {
 tab='profile';p:any;company:any={companyName:'',workspace:'',timezone:'',locale:''};notifications:any={leaveAlerts:true,attendanceAlerts:true,recruitmentAlerts:true};
 id=Number(localStorage.getItem('hrms_employee_id'));role=localStorage.getItem('hrms_role')||'EMPLOYEE';manager=['ADMIN','HR_MANAGER'].includes(this.role);
 error='';message='';imageUrl='';currentPassword='';newPassword='';
 constructor(private api:ApiService,public theme:ThemeService){}
 ngOnInit(){this.load();this.api.get<any>('/settings/company').subscribe({next:v=>this.company=v,error:e=>this.fail(e)});this.api.get<any>('/settings/notifications').subscribe({next:v=>this.notifications=v,error:e=>this.fail(e)});}
 ngOnDestroy(){if(this.imageUrl)URL.revokeObjectURL(this.imageUrl);}
 fail(e:any){this.error=ApiService.errorMessage(e);this.message='';}
 load(){if(!this.id)return;this.api.get<any>(`/profile/${this.id}`).subscribe({next:v=>{this.p=v;this.loadImage()},error:e=>this.fail(e)});}
 loadImage(){if(!this.p?.profileImageUrl)return;this.api.blob(`/profile/${this.id}/image-file`).subscribe({next:b=>{if(this.imageUrl)URL.revokeObjectURL(this.imageUrl);this.imageUrl=URL.createObjectURL(b)},error:()=>{this.imageUrl=''}});}
 saveProfile(){if(!this.p)return;this.error='';this.api.put(`/profile/${this.id}`,{...this.p,departmentId:this.p.department?.id}).subscribe({next:()=>{this.message='Profile saved';localStorage.setItem('hrms_name',`${this.p.firstName} ${this.p.lastName}`);this.load()},error:e=>this.fail(e)});}
 upload(ev:Event){const f=(ev.target as HTMLInputElement).files?.[0];if(f)this.api.upload(`/profile/${this.id}/image`,f).subscribe({next:()=>{this.message='Photo uploaded';this.load()},error:e=>this.fail(e)});}
 saveCompany(){this.api.put('/settings/company',this.company).subscribe({next:()=>this.message='Company preferences saved',error:e=>this.fail(e)});}
 saveNotifications(){this.api.put('/settings/notifications',this.notifications).subscribe({next:()=>this.message='Notification preferences saved',error:e=>this.fail(e)});}
 changePassword(){this.error='';this.api.post('/auth/change-password',{currentPassword:this.currentPassword,newPassword:this.newPassword}).subscribe({next:()=>{this.message='Password changed';this.currentPassword='';this.newPassword=''},error:e=>this.fail(e)});}
}
