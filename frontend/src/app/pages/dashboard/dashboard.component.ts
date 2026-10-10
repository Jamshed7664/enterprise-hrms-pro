import { IconComponent } from '../../ui/icon.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';

@Component({standalone:true,imports:[CommonModule,RouterLink, IconComponent],template:`
<div class="page-head">
    <div>
        <span class="section-label">HR Overview</span>
        <h1>Workforce Dashboard</h1>
        <p>Monitor people operations, attendance, approvals and hiring from one workspace.</p>
    </div>
    <a class="btn primary" routerLink="/employees"><app-icon name="user-plus" /> Add Employee</a>
</div>
<div class="kpi-grid six">
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="users" /></div>
        <div class="kpi-copy">
            <span>Total Employees</span><strong>{{employees.length}}</strong><small>Across all departments</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="check-circle" /></div>
        <div class="kpi-copy">
            <span>Active Employees</span><strong>{{activeEmployees}}</strong><small>Current workforce</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="calendar" /></div>
        <div class="kpi-copy"><span>On Leave</span><strong>{{onLeave}}</strong><small>Approved leave</small></div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="check-circle" /></div>
        <div class="kpi-copy">
            <span>Pending Approvals</span><strong>{{pending}}</strong><small>Needs action</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="briefcase" /></div>
        <div class="kpi-copy">
            <span>Open Positions</span><strong>{{openPositions}}</strong><small>Active vacancies</small>
        </div>
    </article>
    <article class="kpi">
        <div class="kpi-icon"><app-icon name="user-plus" /></div>
        <div class="kpi-copy"><span>New Joiners</span><strong>{{newJoiners}}</strong><small>This year</small></div>
    </article>
</div>
<div class="grid-2">
    <section class="card">
        <div class="card-head">
            <div>
                <span class="section-label">Workforce</span>
                <h2>Department distribution</h2>
            </div>
            <span class="muted">{{employees.length}} employees</span>
        </div>
        <div *ngFor="let d of distribution" class="progress-row">
            <div class="progress-meta"><span>{{d.name}}</span><strong>{{d.count}}</strong></div>
            <div class="progress"><i [style.width.%]="d.percent"></i></div>
        </div>
    </section>
    <section class="card">
        <div class="card-head">
            <div>
                <span class="section-label">Today</span>
                <h2>Attendance summary</h2>
            </div>
        </div>
        <div class="summary-grid">
            <div class="summary-box"><span>Present</span><strong>{{attCount('PRESENT')}}</strong></div>
            <div class="summary-box"><span>Late</span><strong>{{attCount('LATE')}}</strong></div>
            <div class="summary-box"><span>WFH</span><strong>{{attCount('WORK_FROM_HOME')}}</strong></div>
            <div class="summary-box"><span>Absent</span><strong>{{attCount('ABSENT')}}</strong></div>
        </div>
    </section>
</div>
<div class="grid-2" style="margin-top: 20px">
    <section class="card">
        <div class="card-head">
            <div>
                <span class="section-label">Approvals</span>
                <h2>Pending requests</h2>
            </div>
            <a routerLink="/leave" class="muted">Review</a>
        </div>
        <p class="muted" *ngIf="!pending">No pending approvals right now.</p>
        <div *ngFor="let l of leaves | slice:0:3" class="detail-line">
            <span>{{l.employee?.firstName}} {{l.employee?.lastName}} · {{l.leaveType}}</span
            ><span class="badge" [class.warning]="l.status==='PENDING'">{{l.status}}</span>
        </div>
    </section>
    <section class="card">
        <div class="card-head">
            <div>
                <span class="section-label">Talent</span>
                <h2>Recruitment pipeline</h2>
            </div>
            <a routerLink="/recruitment" class="muted">Open ATS</a>
        </div>
        <div *ngFor="let c of candidates | slice:0:4" class="detail-line">
            <span>{{c.name}} · {{c.position}}</span><span class="badge">{{c.stage}}</span>
        </div>
    </section>
</div>
`})
export class DashboardComponent implements OnInit{
 employees:any[]=[];leaves:any[]=[];attendance:any[]=[];candidates:any[]=[];departments:any[]=[];
 constructor(private api:ApiService){}
 ngOnInit(){forkJoin({employees:this.api.get<any[]>('/employees'),leaves:this.api.get<any[]>('/leaves'),attendance:this.api.get<any[]>('/attendance'),candidates:this.api.get<any[]>('/candidates'),departments:this.api.get<any[]>('/departments')}).subscribe(x=>Object.assign(this,x));}
 get activeEmployees(){return this.employees.filter(e=>e.status==='ACTIVE').length}get onLeave(){return this.leaves.filter(l=>l.status==='APPROVED').length}get pending(){return this.leaves.filter(l=>l.status==='PENDING').length}get openPositions(){return new Set(this.candidates.map(c=>c.position)).size}get newJoiners(){return this.employees.filter(e=>String(e.joinDate||'').startsWith('2026')).length}
 get distribution(){const total=Math.max(this.employees.length,1);return this.departments.map(d=>{const count=this.employees.filter(e=>e.department?.id===d.id).length;return{name:d.name,count,percent:Math.max(5,(count/total)*100)}})}
 attCount(s:string){return this.attendance.filter(a=>a.status===s).length}
}
