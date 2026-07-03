---
name: nest-graphql-rbac
description: 'Use when adding or changing NestJS GraphQL resolvers, services, DTOs, auth guards, role/permission checks, Prisma schema changes, or mailer flows in this workspace.'
---

# NestJS GraphQL RBAC Workflow

## When to Use

- Add or refactor GraphQL queries and mutations
- Change authentication or permission rules
- Update Prisma models, migrations, or generated client usage
- Extend user, role, permission, or mail flows

## Workflow

1. Identify the owning module under `src/modules/*` and keep resolver code thin.
2. Check whether the change touches auth, roles, permissions, or Prisma schema.
3. Update DTOs, response models, decorators, and guards together when the API shape changes.
4. If the schema changes, create a migration and regenerate Prisma before validating the feature.
5. Keep GraphQL context, guard behavior, and error messages aligned with the existing app.
6. Validate with the narrowest useful command first, then expand to `npm run lint` or `npm run build` if needed.

## Project Map

- `src/modules/users` owns register, login, verify, logout, and current-user flows.
- `src/modules/roles` owns role management and permission assignment.
- `src/modules/permissions` owns permission CRUD.
- `src/guards/auth.guard.ts` handles JWT authentication for GraphQL requests.
- `src/guards/roles.guard.ts` enforces permission checks from resolver metadata.
- `src/decorators/*` holds current-user, permission, and response metadata helpers.
- `prisma/schema.prisma` is the source of truth for database structure.
