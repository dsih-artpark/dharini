# `backend/script/`

Ad-hoc SQL. **None of it runs automatically** — nothing in the app, the
Dockerfile, or CI references these files. They exist so an operator can apply a
change to an already-running database without waiting for a deploy.

The authoritative sources remain:

- schema → `src/migrations/` (run on boot in non-development, see `src/main.ts`)
- roles and permissions → `src/seeder/data.ts` + `SeederService.seed()`

Anything here is therefore a **duplicate of one of those**, kept only for
manual application. If you change a role or a column, change the seeder or add
a migration; do not treat editing a file here as making the change.

| File | Duplicates | Notes |
|---|---|---|
| `workspace-admin-user-permissions.sql` | `src/seeder/data.ts` (`workspace-admin`) | Adds `read user` / `update user`. Idempotent. Superseded by the next seeder run. |
| `workspace-admin-sample-species-permissions.sql` | `src/seeder/data.ts` (`workspace-admin`) | Same shape, for sample/species permissions. Idempotent. |
| `drop-team-email-unique.sql` | migration `1786500000000-DropTeamEmailUniqueConstraint` | Uses `IF EXISTS`, safe to re-run. Only needed on a database the migration has not reached. |
| `migration.sql` | `src/migrations/1755598844281-init.ts` | **Dead.** A hand-written snapshot of the original schema, predating the TypeORM migration. Do not run it against any live database — it will collide with the migration table's view of the world. Kept only as a historical reference; delete it once nobody recognises it. |
