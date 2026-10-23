import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/modules/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { diseases, roles, sampleTypes, surveillanceTypes } from './data';
import { seedGeoLensData } from './seed-geolens';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Disease)
    private diseaseRepository: Repository<Disease>,
    @InjectRepository(SurveillanceType)
    private surveillanceTypeRepository: Repository<SurveillanceType>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(SampleType)
    private sampleTypeRepository: Repository<SampleType>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async seed() {
    await this.seedRegions();

    // Seed roles and permissions
    for (const roleData of roles) {
      let role = await this.roleRepository.findOne({
        where: { name: roleData.name },
        relations: ['permissions'], // Ensure permissions are loaded
      });

      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name,
          scope: roleData.scope,
          type: roleData.type,
        });
        role = await this.roleRepository.save(role);
      } else if (role.scope !== roleData.scope || role.type !== roleData.type) {
        // `scope` is read on every authorization decision (AbilityFactory
        // resolves the acting scope from `role.scope`), but it used to be
        // written only on insert - so editing a role's scope in data.ts had
        // no effect on any database where that role already existed, and the
        // row silently kept the column default of 'system', i.e. manage-all.
        // Reconcile it here so data.ts is genuinely the source of truth.
        role.scope = roleData.scope;
        role.type = roleData.type;
        role = await this.roleRepository.save(role);
      }

      // Extract new permissions from input
      const newPermissions = roleData.permissions;

      // Fetch existing permissions associated with this role
      const existingPermissions = role.permissions || [];

      // Create a Set of new permission identifiers (action-subject)
      const newPermissionSet = new Set(
        newPermissions.map((p) => `${p.action}-${p.subject}`),
      );

      // Identify permissions to remove
      const permissionsToRemove = existingPermissions.filter(
        (existingPermission) =>
          !newPermissionSet.has(
            `${existingPermission.action}-${existingPermission.subject}`,
          ),
      );

      if (permissionsToRemove.length > 0) {
        role.permissions = existingPermissions.filter(
          (p) => !permissionsToRemove.includes(p),
        );

        await this.roleRepository.save(role);
      }

      // Now, process new permissions
      for (const permissionData of newPermissions) {
        let permission = await this.permissionRepository.findOne({
          where: {
            action: permissionData.action,
            subject: permissionData.subject,
            scope: role.scope,
          },
        });

        if (!permission) {
          permission = this.permissionRepository.create({
            ...permissionData,
            scope: role.scope,
          });
          permission = await this.permissionRepository.save(permission);
        }

        if (!role.permissions) {
          role.permissions = [];
        }
        // Ensure permission is added if not present
        if (!role.permissions?.some((p) => p.id === permission.id)) {
          role.permissions?.push(permission);
        }
      }

      // Final save after updates
      await this.roleRepository.save(role);
    }

    // Seed diseases
    for (const diseaseData of diseases) {
      const existingDisease = await this.diseaseRepository.findOne({
        where: { code: diseaseData.code },
      });
      if (!existingDisease) {
        const disease = this.diseaseRepository.create(diseaseData);
        await this.diseaseRepository.save(disease);
      }
    }

    // Seed surveillance types
    for (const typeData of surveillanceTypes) {
      const existingType = await this.surveillanceTypeRepository.findOne({
        where: { name: typeData.name },
      });
      if (!existingType) {
        const surveillanceType =
          this.surveillanceTypeRepository.create(typeData);
        await this.surveillanceTypeRepository.save(surveillanceType);
      }
    }

    for (const typeData of sampleTypes) {
      let surveillanceType = await this.surveillanceTypeRepository.findOne({
        where: { name: typeData.name },
      });

      if (!surveillanceType) {
        surveillanceType = this.surveillanceTypeRepository.create({
          name: typeData.name,
        });
        await this.surveillanceTypeRepository.save(surveillanceType);
      }

      for (const sample of typeData.samples) {
        const existingSampleType = await this.sampleTypeRepository.findOne({
          where: {
            name: sample.name,
            surveillanceType: { id: surveillanceType.id },
          },
        });

        // Only create when missing. Do NOT update existing sample types —
        // emojiIcon and diseaseShortNames may be edited manually in the DB
        // and must not be overwritten on every deployment/restart.
        if (!existingSampleType) {
          const sampleEntry = this.sampleTypeRepository.create({
            name: sample.name,
            surveillanceType,
            emojiIcon: sample.emojiIcon,
            diseaseShortNames: sample.diseases,
          });
          await this.sampleTypeRepository.save(sampleEntry);
        }
      }
    }

    await this.seedSuperAdmin();

    console.log('Database seeded successfully.');

    // await this.teamsService.scriptTeamMember();

    // await this.mediaService.updateMediaPaths();

    // await this.sampleService.sampleStatusScript();
  }

  /**
   * Creates the first super admin from SUPER_ADMIN_EMAIL (plus optional name
   * and phone), so no real person's details live in the code. Skipped when the
   * variable is unset or the user already exists. A failure is logged, never
   * thrown: seed() runs before the API listens, so a throw here would leave
   * the backend up but not serving.
   */
  private async seedSuperAdmin(): Promise<void> {
    const email = process.env.SUPER_ADMIN_EMAIL?.trim();
    if (!email) {
      console.warn('SUPER_ADMIN_EMAIL is not set; no super admin was seeded.');
      return;
    }

    try {
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) return;

      await this.userService.create({
        firstName: process.env.SUPER_ADMIN_FIRST_NAME?.trim() || 'Super',
        lastName: process.env.SUPER_ADMIN_LAST_NAME?.trim() || 'Admin',
        email,
        role: 'super-admin',
        contactNumber: process.env.SUPER_ADMIN_PHONE?.trim() || undefined,
      });
      console.log(`Seeded super admin ${email}.`);
    } catch (error) {
      console.error('Failed to seed the super admin:', error);
    }
  }

  /**
   * Loads the GeoLens map-layer reference tables. Kept out of seed() because
   * a brand-new database has ~555k rows to insert and none of it is needed to
   * serve requests, so main.ts starts this after the API is listening. Each
   * empty layer is filled once in its own transaction and a failure is logged,
   * never thrown - see seedGeoLensData.
   */
  seedGeoLens(): Promise<string[]> {
    return seedGeoLensData(this.dataSource);
  }

  /**
   * Loads the country, state and district rows from regions.sql into an empty
   * `regions` table. A table that already has rows is never touched. Runs in
   * one transaction under an advisory lock, so two instances starting together
   * can't both load it and a failure leaves the table empty for the next start
   * to retry. The failure is logged, never thrown: seed() runs before the API
   * listens, so a throw would leave the backend up but not serving.
   */
  private async seedRegions(): Promise<void> {
    const file = path.resolve(process.cwd(), 'regions.sql');
    try {
      if (!fs.existsSync(file)) {
        console.warn(`regions.sql not found at ${file}; regions not seeded.`);
        return;
      }

      await this.dataSource.transaction(async (manager) => {
        const [{ locked }] = await manager.query(
          `SELECT pg_try_advisory_xact_lock(hashtext($1)) AS locked`,
          ['seed:regions'],
        );
        if (!locked) {
          console.log(
            'Regions are being seeded by another instance, skipping.',
          );
          return;
        }

        const [{ populated }] = await manager.query(
          `SELECT EXISTS (SELECT 1 FROM regions) AS populated`,
        );
        if (populated) return;

        await manager.query(fs.readFileSync(file, 'utf-8'));
        console.log('Seeded regions from regions.sql.');
      });
    } catch (error) {
      console.error('Failed to seed regions:', error);
    }
  }
}
