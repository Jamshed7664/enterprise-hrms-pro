# Enterprise HRMS UI Upgrade (Angular 20)

This frontend is a fresh Angular implementation styled to closely follow the supplied Enterprise HRMS screenshots while keeping the existing Spring Boot API integration.

## Included UI
- Fixed left navigation matching the screenshot structure
- HR Workspace top header
- Light/Dark mode toggle in the header
- Theme persisted in `localStorage` under `hrms_theme`
- Dashboard with six KPI cards, department distribution, attendance summary, approvals and recruitment preview
- Employee directory with search, department filter, view/edit/status/delete actions
- Employee detail/profile route
- Organization / Departments & Structure
- Attendance Management with Clock In / Clock Out
- Leave Management with apply/approve/reject flows
- Timesheets
- Payroll Overview
- Performance Management
- Recruitment / applicant tracking board
- Document Center
- Reports & Analytics with CSV export
- Administration / RBAC layout
- Settings & Self Service with profile image upload and theme control

## Run
```bash
npm install
npm start
```

Frontend: http://localhost:4200
Backend expected: http://localhost:8080

## Important
Keep the Spring Boot backend running before using API-backed screens.
If your backend CORS is restricted, allow `http://localhost:4200`.
