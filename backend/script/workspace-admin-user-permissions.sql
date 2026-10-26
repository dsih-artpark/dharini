-- Adds the missing `read user` / `update user` permissions to the
-- workspace-admin role, matching what SeederService.seed() would do on next
-- boot in a non-development NODE_ENV. Safe to re-run (idempotent).
BEGIN;

-- 1. Ensure the two permission rows exist, scoped like workspace-admin's
--    other permissions ('workspace' scope, matching role.scope).
INSERT INTO permissions (id, scope, action, subject, status)
SELECT gen_random_uuid(), 'workspace', 'read', 'user', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM permissions WHERE scope = 'workspace' AND action = 'read' AND subject = 'user'
);

INSERT INTO permissions (id, scope, action, subject, status)
SELECT gen_random_uuid(), 'workspace', 'update', 'user', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM permissions WHERE scope = 'workspace' AND action = 'update' AND subject = 'user'
);

-- 2. Link both permissions to the workspace-admin role via the join table.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'workspace-admin'
  AND p.scope = 'workspace' AND p.action = 'read' AND p.subject = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'workspace-admin'
  AND p.scope = 'workspace' AND p.action = 'update' AND p.subject = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

COMMIT;

-- Verify:
-- SELECT p.action, p.subject, p.scope
-- FROM roles r
-- JOIN role_permissions rp ON rp.role_id = r.id
-- JOIN permissions p ON p.id = rp.permission_id
-- WHERE r.name = 'workspace-admin'
-- ORDER BY p.action, p.subject;
