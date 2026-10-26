import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProjectAdminRoles1770876900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting migration: Fix project admin roles');

    // Get the role IDs for team-admin and project-viewer
    const teamAdminRole = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'team-admin' LIMIT 1
    `);

    const projectViewerRole = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'project-viewer' LIMIT 1
    `);

    if (!teamAdminRole.length || !projectViewerRole.length) {
      console.log(
        'Required roles not found in database. If this is a fresh installation, this is expected as seeding happens after migrations. Skipping...',
      );
      return;
    }

    const teamAdminRoleId = teamAdminRole[0].id;
    const projectViewerRoleId = projectViewerRole[0].id;

    console.log(`Team-admin role ID: ${teamAdminRoleId}`);
    console.log(`Project-viewer role ID: ${projectViewerRoleId}`);

    // Find all user_roles with project-viewer role that have team and project assigned
    const projectViewerUserRoles = await queryRunner.query(
      `
      SELECT
        ur.id,
        ur."userId",
        ur.team,
        ur.project,
        ur.status
      FROM user_roles ur
      WHERE ur."roleId" = $1
        AND ur.team IS NOT NULL
        AND ur.project IS NOT NULL
        AND ur.status = 'active'
    `,
      [projectViewerRoleId],
    );

    console.log(
      `Found ${projectViewerUserRoles.length} project-viewer user roles to update`,
    );

    // For each project-viewer user role with team/project scope
    for (const userRole of projectViewerUserRoles) {
      console.log(
        `Processing user ${userRole.userId}, team ${userRole.team}, project ${userRole.project}`,
      );

      // Check if team-admin role already exists for this user/team/project combination
      const existingTeamAdminRole = await queryRunner.query(
        `
        SELECT id FROM user_roles
        WHERE "userId" = $1
          AND "roleId" = $2
          AND team = $3
          AND project = $4
          AND status = 'active'
      `,
        [userRole.userId, teamAdminRoleId, userRole.team, userRole.project],
      );

      if (existingTeamAdminRole.length > 0) {
        console.log(`  Team-admin role already exists, skipping creation`);
      } else {
        // Create team-admin role for this user/team/project
        await queryRunner.query(
          `
          INSERT INTO user_roles ("userId", "roleId", team, project, status)
          VALUES ($1, $2, $3, $4, 'active')
        `,
          [userRole.userId, teamAdminRoleId, userRole.team, userRole.project],
        );
        console.log(`  Created team-admin role`);
      }

      // Check if unscoped project-viewer role exists
      const existingUnscopedProjectViewer = await queryRunner.query(
        `
        SELECT id FROM user_roles
        WHERE "userId" = $1
          AND "roleId" = $2
          AND team IS NULL
          AND project IS NULL
          AND status = 'active'
      `,
        [userRole.userId, projectViewerRoleId],
      );

      if (existingUnscopedProjectViewer.length > 0) {
        console.log(`  Unscoped project-viewer role already exists`);
        // Delete the scoped project-viewer role since we have an unscoped one
        await queryRunner.query(
          `
          DELETE FROM user_roles WHERE id = $1
        `,
          [userRole.id],
        );
        console.log(`  Deleted scoped project-viewer role`);
      } else {
        // Update the existing project-viewer role to be unscoped
        await queryRunner.query(
          `
          UPDATE user_roles
          SET team = NULL, project = NULL
          WHERE id = $1
        `,
          [userRole.id],
        );
        console.log(`  Updated project-viewer role to be unscoped`);
      }
    }

    console.log('Migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Rolling back migration: Fix project admin roles');
    console.log(
      'NOTE: This rollback will not restore the exact previous state.',
    );
    console.log(
      'It will remove team-admin roles created by this migration, but cannot',
    );
    console.log('accurately restore the original scoped project-viewer roles.');

    // Get the role IDs
    const teamAdminRole = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'team-admin' LIMIT 1
    `);

    const projectViewerRole = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'project-viewer' LIMIT 1
    `);

    if (!teamAdminRole.length || !projectViewerRole.length) {
      console.error('Required roles not found in database');
      return;
    }

    const teamAdminRoleId = teamAdminRole[0].id;
    const projectViewerRoleId = projectViewerRole[0].id;

    // Find all team-admin user roles
    const teamAdminUserRoles = await queryRunner.query(
      `
      SELECT
        ur.id,
        ur."userId",
        ur.team,
        ur.project
      FROM user_roles ur
      WHERE ur."roleId" = $1
        AND ur.team IS NOT NULL
        AND ur.project IS NOT NULL
        AND ur.status = 'active'
    `,
      [teamAdminRoleId],
    );

    console.log(
      `Found ${teamAdminUserRoles.length} team-admin user roles to remove`,
    );

    // Remove team-admin roles and restore scoped project-viewer roles
    for (const userRole of teamAdminUserRoles) {
      // Delete the team-admin role
      await queryRunner.query(
        `
        DELETE FROM user_roles WHERE id = $1
      `,
        [userRole.id],
      );

      // Check if there's an unscoped project-viewer role
      const unscopedProjectViewer = await queryRunner.query(
        `
        SELECT id FROM user_roles
        WHERE "userId" = $1
          AND "roleId" = $2
          AND team IS NULL
          AND project IS NULL
      `,
        [userRole.userId, projectViewerRoleId],
      );

      if (unscopedProjectViewer.length > 0) {
        // Update it to be scoped to the team/project
        await queryRunner.query(
          `
          UPDATE user_roles
          SET team = $1, project = $2
          WHERE id = $3
        `,
          [userRole.team, userRole.project, unscopedProjectViewer[0].id],
        );
      }
    }

    console.log('Rollback completed');
  }
}
