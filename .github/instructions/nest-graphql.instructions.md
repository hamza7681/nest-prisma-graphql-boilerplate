---
description: 'Use when editing NestJS GraphQL resolvers, services, DTOs, guards, Prisma models, auth, permissions, roles, or mailer code in this workspace.'
name: 'NestJS GraphQL Conventions'
applyTo: 'src/**/*.ts, prisma/**/*.prisma'
---

# NestJS GraphQL Conventions

- Keep resolvers thin; move business rules into services.
- Preserve the existing auth flow: `AuthGuard` for JWT, `RolesGuard` for permission checks, and `RequirePermission` for resolver metadata.
- When adding protected operations, wire them with the same GraphQL context pattern used in `src/app.module.ts` and `src/main.ts`.
- Use DTOs for input and response types; keep validation decorators and GraphQL types in sync.
- Prefer the existing `PERMISSIONS` and `ROLES` constants instead of hard-coded strings.
- For Prisma schema updates, update the schema, create a migration, and regenerate the client before relying on the new fields.
- Keep email/template changes inside `src/modules/email/templates` and preserve the current mailer module patterns.
- Avoid introducing side effects in resolvers or guards when a service can own the work.
- Match the current error style for auth, authorization, and GraphQL exceptions.
- After meaningful edits, run the smallest relevant validation first: `npm run format`, `npm run lint`, or `npm run build`.
