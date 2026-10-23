-- Grants workspace-admin the ability to manage sample-types and create/update
-- species. Without these, workspace-admins see "Access Denied" on the
-- Manage Sample Types and Manage Species pages.
-- Safe to re-run (idempotent).
BEGIN;

-- 1. Ensure the permission rows exist.
INSERT INTO permissions (id, scope, action, subject, status)
SELECT gen_random_uuid(), 'workspace', 'manage', 'sample-type', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM permissions WHERE scope = 'workspace' AND action = 'manage' AND subject = 'sample-type'
);

INSERT INTO permissions (id, scope, action, subject, status)
SELECT gen_random_uuid(), 'workspace', 'create', 'species', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM permissions WHERE scope = 'workspace' AND action = 'create' AND subject = 'species'
);

INSERT INTO permissions (id, scope, action, subject, status)
SELECT gen_random_uuid(), 'workspace', 'update', 'species', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM permissions WHERE scope = 'workspace' AND action = 'update' AND subject = 'species'
);

-- 2. Link permissions to the workspace-admin role.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'workspace-admin'
  AND p.scope = 'workspace' AND p.action = 'manage' AND p.subject = 'sample-type'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'workspace-admin'
  AND p.scope = 'workspace' AND p.action = 'create' AND p.subject = 'species'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'workspace-admin'
  AND p.scope = 'workspace' AND p.action = 'update' AND p.subject = 'species'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

COMMIT;
