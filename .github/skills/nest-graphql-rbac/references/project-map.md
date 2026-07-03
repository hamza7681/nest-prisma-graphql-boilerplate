# Project Map

- `src/app.module.ts` wires GraphQL, Prisma, mailer, and feature modules.
- `src/main.ts` sets validation pipes, cookie parsing, CORS, and the GraphQL app bootstrap.
- `src/modules/users` contains auth-facing GraphQL operations.
- `src/modules/roles` contains role administration operations.
- `src/modules/permissions` contains permission administration operations.
- `src/modules/email` contains mail transport and templates.
- `src/generated/prisma` contains the generated Prisma client checked into the repo.
