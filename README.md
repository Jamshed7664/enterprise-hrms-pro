# Enterprise HRMS Pro — Angular 20 + Spring Boot 3.5.6

**Updated source-code edition of the user-supplied HRMS**, preserving its existing Angular UI and adding security and real backend functionality to previously placeholder modules. Branding: **Code With Jamshed**.

> ⚠️ **Pre-release demo/source-code template — not certified production-ready.** The current execution environment could parse the Java/TypeScript source but could not install npm packages or run a Maven build. Follow [the release checklist](docs/RELEASE_CHECKLIST.md) and fix any integration findings before selling or hosting a publicly accessible demo. Tax-compliant payroll, notifications delivery and workflow enforcement are not implemented.

## Project layout

```
Enterprise-HRMS-Pro/
├── frontend/                  Angular 20, original enterprise layout
│   ├── src/app/pages/          All HRMS pages
│   ├── src/assets/config.js    PUBLIC production API URL
│   ├── proxy.conf.json         Dev-server /api → localhost:8080
│   └── package.json
├── backend/                   Spring Boot 3.5.6 / Java 21 / MySQL
│   ├── src/main/java/         APIs, security, entities, services
│   └── pom.xml
├── docs/                      API and release checklist
├── docker-compose.yml         Local MySQL + backend
└── .env.example               Placeholder config only
```

## Features included

- Login with BCrypt password hashing and **signed expiring JWT**; protected endpoints and ADMIN/HR_MANAGER/EMPLOYEE roles.
- Dashboard, employee CRUD/archive, departments, attendance, leave, timesheets, recruitment pipeline.
- Payroll viewing, mark-paid operation and CSV statement download (**not statutory payroll**).
- Persisted performance review/goal records with progress updates.
- Authorized document upload/list/download/delete with file validation and size limits.
- Self profile edit, authenticated profile photo upload/read.
- Admin create/disable/assign roles to users, approval flags and a basic audit log.
- Company and user notification preferences, change password with token-version invalidation.
- Responsive existing UI, light/dark mode, browser report/CSV features.

## Fastest Windows setup (Docker Desktop + Node.js)

Install Docker Desktop, Git, and an Angular 20 compatible Node.js version (Node 22.12+ is suitable). Clone or extract this folder. Do NOT upload your `.env` file to GitHub.

1. In a terminal at repository root:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

   **Replace** `JWT_SECRET`, `DEMO_ADMIN_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD` with unique strong values. Make JWT secret with a password manager or Python:

   ```powershell
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```

2. Start database and backend:

   ```powershell
   docker compose up --build -d
   docker compose logs -f backend
   ```

   Docker MySQL port: `localhost:3307` (host only), app backend: `http://localhost:8080` (host only).

3. In a **new terminal**, run frontend:

   ```powershell
   cd frontend
   npm ci
   npm start
   ```

   Open `http://localhost:4200`; email is `DEMO_ADMIN_EMAIL` (default `admin@hrms.dev`), password is your own `.env` value for `DEMO_ADMIN_PASSWORD`.

4. Stop without deleting data:

   ```powershell
   docker compose down
   ```

   **Do not use** `docker compose down -v` unless you intentionally want to delete all local demo database and upload data.

## Alternative without Docker — local MySQL

Install JDK 21, Maven 3.9+, MySQL 8.0/8.4, Node.js 22 and npm. Create `hrms_db` and a non-root user (see example SQL below) and set the backend environment variables:

```sql
CREATE DATABASE IF NOT EXISTS hrms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hrms_app'@'localhost' IDENTIFIED BY 'CHOOSE_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON hrms_db.* TO 'hrms_app'@'localhost';
```

In PowerShell (for this terminal session only):

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/hrms_db'
$env:DB_USERNAME = 'hrms_app'
$env:DB_PASSWORD = 'YOUR_MYSQL_APP_PASSWORD'
$env:JWT_SECRET = 'YOUR_RANDOM_SECRET_MINIMUM_32_BYTES'
$env:DEMO_SEED = 'true'
$env:DEMO_ADMIN_PASSWORD = 'YOUR_STRONG_DEMO_PASSWORD'
cd backend
mvn clean test
mvn spring-boot:run
```

Angular development proxy avoids CORS issues locally. In another terminal run `cd frontend`, `npm ci`, `npm start`.

## Deployment

- **Public repo:** screenshots, README, public live demo link only. Do not publish paid source code if private distribution is your goal.
- **Private repo:** put all files from this folder in one private GitHub repository. Exclude `.env`, local data and uploaded photos.
- **Frontend:** Angular build output `frontend/dist/angular-hrms-frontend/browser`. Update `frontend/src/assets/config.js` with actual HTTPS backend `/api` endpoint **before** building. Serve SPA fallback to `index.html` (Netlify `_redirects` is provided).
- **Backend:** deploy Docker image from `backend/Dockerfile` with managed MySQL and persistent storage for documents/images. Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS`, `UPLOAD_DIR`. Do NOT use local demo passwords on the public Internet.
- **DB lifecycle:** for a public demo, use only fake employee data, restrict write operations, and regularly reset a separate demo database. Before real business use add audited migrations, automatic backup, rate limiting and tests.

## Your product listing

Suggested product: **Enterprise HRMS Pro — Angular 20 + Spring Boot Source Code**. You may offer this as a **developer source-code template**, subject to ensuring you own all licensed code/assets. Only advertise features that you have tested. Provide source ZIP, README, commercial-license terms and demo link. Price is your decision; ₹7,999 is an experimental starting price, not a guaranteed market rate.

## Legal and feature boundaries

This implementation is provided for development/learning purposes, not a substitute for independent security review or verified HR/payroll compliance. Audit logging does not capture every read or modification. No automatic payroll tax, statutory tax filing, biometric hardware integration, scheduled notifications, SaaS tenant isolation, online payments, payroll banking or fully enforced configurable approval chains. Update user-facing marketing accordingly.

See [docs/API.md](docs/API.md) and [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).
