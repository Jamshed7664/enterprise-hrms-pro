import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../core/theme.service';
import { ToastService } from '../core/toast.service';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="app-shell">
      <div *ngIf="sidebarOpen" class="mobile-nav-backdrop" (click)="sidebarOpen=false" aria-hidden="true"></div>
      <aside class="sidebar" [class.sidebar-open]="sidebarOpen" aria-label="Main navigation">
        <div class="brand-row">
          <div class="brand-mark">CJ</div>
          <div class="brand-copy"><strong>Enterprise HRMS</strong><small>Code With Jamshed</small></div>
          <button class="icon-btn sidebar-close" type="button" (click)="sidebarOpen=false" aria-label="Close navigation"><app-icon name="close" /></button>
        </div>
        <div class="nav-section-title">WORKSPACE</div>
        <nav class="side-nav">
          <a *ngIf="canManage" routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()"><app-icon name="dashboard" />Dashboard</a>
          <a *ngIf="canManage" routerLink="/employees" routerLinkActive="active" (click)="closeMenu()"><app-icon name="users" />Employees</a>
          <a *ngIf="canManage" routerLink="/organization" routerLinkActive="active" (click)="closeMenu()"><app-icon name="building" />Organization</a>
          <a *ngIf="canManage" routerLink="/attendance" routerLinkActive="active" (click)="closeMenu()"><app-icon name="clock" />Attendance</a>
          <a *ngIf="canManage" routerLink="/leave" routerLinkActive="active" (click)="closeMenu()"><app-icon name="calendar" />Leave Management</a>
          <a *ngIf="canManage" routerLink="/timesheets" routerLinkActive="active" (click)="closeMenu()"><app-icon name="file" />Timesheets</a>
          <a *ngIf="canManage" routerLink="/payroll" routerLinkActive="active" (click)="closeMenu()"><app-icon name="wallet" />Payroll</a>
          <a *ngIf="canManage" routerLink="/performance" routerLinkActive="active" (click)="closeMenu()"><app-icon name="target" />Performance</a>
          <a *ngIf="canManage" routerLink="/recruitment" routerLinkActive="active" (click)="closeMenu()"><app-icon name="briefcase" />Recruitment</a>
          <a routerLink="/documents" routerLinkActive="active" (click)="closeMenu()"><app-icon name="file" />Documents</a>
          <a *ngIf="canManage" routerLink="/reports" routerLinkActive="active" (click)="closeMenu()"><app-icon name="chart" />Reports & Analytics</a>
          <a *ngIf="isAdmin" routerLink="/administration" routerLinkActive="active" (click)="closeMenu()"><app-icon name="shield" />Administration</a>
        </nav>
        <div class="nav-section-title nav-section-divider">ACCOUNT</div>
        <nav class="side-nav side-nav-account">
          <a routerLink="/settings" routerLinkActive="active" (click)="closeMenu()"><app-icon name="settings" />Settings</a>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user"><div class="avatar">{{initials}}</div><div><strong>{{displayName}}</strong><small>{{roleLabel}}</small></div></div>
          <button class="logout-link" type="button" (click)="logout()"><app-icon name="logout" />Sign out</button>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <button class="icon-btn mobile-menu-toggle" type="button" (click)="sidebarOpen=true" aria-label="Open navigation" [attr.aria-expanded]="sidebarOpen"><app-icon name="menu" /></button>
            <div class="workspace-copy"><strong>HR Workspace</strong><small>People · Operations · Insights</small></div>
          </div>
          <div class="topbar-actions">
            <span class="header-status"><span class="status-dot"></span>Workspace</span>
            <button class="icon-btn theme-toggle" type="button" (click)="theme.toggle()" [attr.aria-label]="theme.dark() ? 'Switch to light mode' : 'Switch to dark mode'" [title]="theme.dark() ? 'Light mode' : 'Dark mode'"><app-icon [name]="theme.dark() ? 'sun' : 'moon'" /></button>
            <a class="icon-btn" routerLink="/settings" aria-label="Notification preferences" title="Notification preferences"><app-icon name="bell" /></a>
            <div class="top-divider"></div>
            <a routerLink="/settings" class="profile-menu"><div class="avatar top-avatar">{{initials}}</div><div class="profile-copy"><strong>{{displayName}}</strong><small>{{roleLabel}}</small></div><app-icon name="chevron" /></a>
          </div>
        </header>
        <section class="page"><router-outlet /></section>
      </main>
    </div>
  `
})
export class ShellComponent {
  sidebarOpen = false;
  isAdmin = localStorage.getItem('hrms_role') === 'ADMIN';
  canManage = ['ADMIN', 'HR_MANAGER'].includes(localStorage.getItem('hrms_role') || '');
  displayName = localStorage.getItem('hrms_name') || 'HRMS User';
  roleLabel = localStorage.getItem('hrms_role') === 'ADMIN' ? 'Administrator'
    : localStorage.getItem('hrms_role') === 'HR_MANAGER' ? 'HR Manager' : 'Employee';

  constructor(public theme: ThemeService, public toast: ToastService, private router: Router) {}
  get initials(): string { return this.displayName.split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase() || 'HR'; }
  closeMenu(): void { this.sidebarOpen = false; }
  logout(): void {
    ['hrms_token', 'hrms_employee_id', 'hrms_name', 'hrms_role', 'hrms_email'].forEach(k => localStorage.removeItem(k));
    this.toast.info('You have signed out of your workspace.');
    this.router.navigate(['/login']);
  }
}
