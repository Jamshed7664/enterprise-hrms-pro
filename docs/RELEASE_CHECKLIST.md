# Release readiness checklist

## Security
- [ ] Generate a unique `JWT_SECRET` (>=32 bytes) and rotate any previously exposed database credentials.
- [ ] Use a dedicated low-privilege MySQL account. Do not run the app as `root`.
- [ ] Set exact `CORS_ORIGINS` for the deployed domain.
- [ ] Protect demo access from abuse. Use synthetic data only, restrict writes or reset periodically.
- [ ] Review account role enforcement, JWT revocation on password reset, user-owned resources.
- [ ] Restrict uploads and back up persistent storage; add malware scanning if offering public uploads.
- [ ] Use HTTPS and server-side rate limits for login and public endpoints.

## Functional acceptance tests
- [ ] Login success, bad credentials fail, missing JWT returns 401; expired/revoked tokens fail.
- [ ] Employee create/edit/status/archive; department create/edit.
- [ ] Clock-in/clock-out and duplicate clock-in rejection.
- [ ] Leave apply/approve/reject and timesheet submit/approve/reject.
- [ ] Recruitment candidate create/move/delete.
- [ ] Profile edit, authorized image upload, unauthorized image access blocked.
- [ ] Document upload/download/delete, malicious image and >5MB rejected.
- [ ] Payroll Mark Paid and CSV download (no statutory claims).
- [ ] Performance review create/progress/delete.
- [ ] Admin user create/role/disable, approval flag storage, audit entries.
- [ ] Company and notification preferences persistence; password change invalidates old token.
- [ ] Dark/light theme, responsive UI, page refresh deep links, API errors.

## Build & deployments
- [ ] `mvn test` and `mvn package` from backend run successfully on JDK 21.
- [ ] `npm ci` and `npm run build` from frontend run successfully.
- [ ] Run browser E2E smoke tests against local MySQL.
- [ ] Run demo against clean DB with `DEMO_SEED=true` and strong demo password.
- [ ] Configure HTTPS API and frontend public URL, confirm CORS and storage persistence.
- [ ] Replace JPA `ddl-auto=update` with proper migrations for production and plan backups.
