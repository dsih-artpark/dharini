-- Drops the globally-unique constraint on teams.email so that the same
-- person can lead a separate team in each project they are added to,
-- rather than a single Team entity being shared (with all its members)
-- across every project it is linked to.
-- Safe to re-run (uses IF EXISTS).

ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "UQ_c89abbc8f98d43fae04eb5c9dc8";
ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "teams_email_key";
DROP INDEX IF EXISTS "UQ_c89abbc8f98d43fae04eb5c9dc8";
