# REST API contract (all paths prefixed `/api`)

Authentication via `Authorization: Bearer <JWT>`, except `POST /auth/login`. The **demo ADMIN** can access all endpoints; HR_MANAGER can use operational modules; EMPLOYEE is limited to profile, own documents and preferences. The server validates access; hiding UI links alone is not authorization.

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `GET /auth/me`, `POST /auth/change-password` |
| Dashboard | `GET /dashboard` |
| Employees | `GET /employees`, `GET /employees/{id}`, `POST /employees`, `PUT /employees/{id}`, `PATCH /employees/{id}/status?value=ACTIVE`, `DELETE /employees/{id}` (archives) |
| Departments | `GET /departments`, `POST /departments`, `PUT /departments/{id}` |
| Attendance | `GET /attendance`, `POST /attendance/clock-in/{employeeId}`, `POST /attendance/clock-out/{id}` |
| Leave | `GET /leaves`, `POST /leaves`, `PATCH /leaves/{id}/status?value=APPROVED` |
| Timesheets | `GET /timesheets`, `POST /timesheets`, `PATCH /timesheets/{id}/status?value=SUBMITTED` |
| Payroll | `GET /payroll`, `PATCH /payroll/{id}/pay`, `GET /payroll/{id}/payslip` (CSV) |
| Recruitment | `GET /candidates`, `POST /candidates`, `PATCH /candidates/{id}/stage?value=INTERVIEW`, `DELETE /candidates/{id}` |
| Performance | `GET /performance`, `POST /performance`, `PATCH /performance/{id}/progress?value=75`, `DELETE /performance/{id}` |
| Documents | `GET /documents`, `POST /documents` (multipart: file, employeeId, category, expiry), `GET /documents/{id}/download`, `DELETE /documents/{id}` |
| Profile | `GET /profile/{id}`, `PUT /profile/{id}`, `POST /profile/{id}/image`, `GET /profile/{id}/image-file` |
| Admin (ADMIN only) | `GET /admin/users`, `POST /admin/users`, `PATCH /admin/users/{id}`, `GET /admin/rules`, `PUT /admin/rules/{id}`, `GET /admin/audit` |
| Settings | `GET/PUT /settings/company`, `GET/PUT /settings/notifications` |

Uploads accept PDF, PNG, JPEG (validated magic bytes, max 5 MB). Profile images accept PNG/JPEG. File content is NOT served from a public `/uploads` directory.

## Important limitations

- Payroll contains manually seeded/basic salary records, and a CSV payslip **not a compliant tax, PF, ESI or payment engine**.
- Approval rules are stored flags, **not** enforced multi-stage workflows yet.
- Notification preferences are persisted, but email/SMS/push delivery is NOT implemented.
- Reports use client-side calculations and CSV export; the 'Export PDF' button opens browser print.
- This is a strong learning/demo/source-code foundation, not an independently audited production HR system.
