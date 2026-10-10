# Spring Boot HRMS REST Backend

Java 21 / Spring Boot 3.5.6 / MySQL 8 / OAuth2 Resource Server (JWT HS256).

See [root README](../README.md) and [API list](../docs/API.md).

Runtime configuration is supplied through environment variables. Backend will fail to start without a JWT secret at least 32 bytes long. Demo data is seeded only with `DEMO_SEED=true` and `DEMO_ADMIN_PASSWORD` at least 12 characters. No database passwords are checked into this repository.

The persistence schema currently uses JPA `ddl-auto=update` for local demos. Production requires versioned database migrations, backups, authorization review, access logging and proper deployment hardening.
