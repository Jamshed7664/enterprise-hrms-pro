# Angular 20 HRMS Frontend

Angular standalone single-page app based on the original uploaded UI.

From the repository root:

```bash
cd frontend
npm ci
npm start
```

Visit <http://localhost:4200>. Angular dev-server uses `proxy.conf.json` to reach the Docker or local Spring Boot API on port 8080.

For hosted deployment: edit `src/assets/config.js`, setting `apiBase` to your HTTPS Spring Boot endpoint including `/api`. Then run `npm run build` and deploy the contents of `dist/angular-hrms-frontend/browser/`. Make sure Angular SPA routing falls back to `index.html`.

Never embed `JWT_SECRET`, database passwords, or private credentials in the Angular bundle. All frontend config is publicly visible.
