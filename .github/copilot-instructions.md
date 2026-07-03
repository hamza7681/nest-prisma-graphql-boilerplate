# Copilot Context

This workspace is a NestJS 11 GraphQL API that uses Prisma, PostgreSQL, JWT auth, RBAC permissions, and mail templates.

Prefer the existing architecture when making changes:

- GraphQL is code-first and lives under `src/modules/*`.
- Authentication uses `AuthGuard` with JWT and GraphQL request context wiring in `src/app.module.ts` and `src/main.ts`.
- Authorization uses `RequirePermission`, `RolesGuard`, and permission constants from `src/constants/user.ts`.
- Business logic belongs in services; resolvers should stay thin.
- DTOs use `class-validator` and should remain aligned with GraphQL response models.
- Prisma schema changes require a migration and `npm run prisma:generate`.
- Keep response and error behavior consistent with the existing GraphQL filter and interceptor.

Common commands:

- `npm run start:dev`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run format`
- `npm run lint`
- `npm run build`
