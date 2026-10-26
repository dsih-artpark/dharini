import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisCacheModule } from './common/cache/redis-cache.module';

// Modules
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disease } from './entities/disease.entity';
import { Invite } from './entities/invite.entity';
import { Kit } from './entities/kit.entity';
import { LabTest } from './entities/lab-test.entity';
import { Location } from './entities/location.entity';
import { Media } from './entities/media.entity';
import { Otp } from './entities/otp.entity';
import { Permission } from './entities/permission.entity';
import { Project } from './entities/project.entity';
import { Region } from './entities/region.entity';
import { Role } from './entities/role.entity';
import { SampleAudit } from './entities/sample-audit.entity';
import { SampleType } from './entities/sample-type.entity';
import { Sample } from './entities/sample.entity';
import { Site } from './entities/site.entity';
import { SurveillanceType } from './entities/surveillance-type.entity';
import { Species } from './entities/species.entity';
import { Team } from './entities/team.entity';
import { UserRole } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { Visit } from './entities/visit.entity';
import { Workspace } from './entities/workspace.entity';
import { BioWetland } from './entities/bio-wetland.entity';
import { BioPoultryFarm } from './entities/bio-poultry-farm.entity';
import { BioCattleMarket } from './entities/bio-cattle-market.entity';
import { BioWaterBoundary } from './entities/bio-water-boundary.entity';
import { AnimalMetadata } from './entities/animal-metadata.entity';
import { PipelineWebhookDelivery } from './entities/pipeline-webhook-delivery.entity';
import { PipelineVariant } from './entities/pipeline-variant.entity';
import { AccessModule } from './modules/access/access.module';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { AuthorizationModule } from './common/authorization/authorization.module';
import { DiseaseModule } from './modules/disease/disease.module';
import { InvitesModule } from './modules/invites/invites.module';
import { KitModule } from './modules/kit/kit.module';
import { LabTestsModule } from './modules/lab-tests/lab-tests.module';
import { LocationModule } from './modules/location/location.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MediaModule } from './modules/media/media.module';
import { OtpModule } from './modules/otp/otp.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RegionModule } from './modules/region/region.module';
import { RolesModule } from './modules/roles/roles.module';
import { SampleTypeModule } from './modules/sample-type/sample-type.module';
import { SpeciesModule } from './modules/species/species.module';
import { SamplesModule } from './modules/samples/samples.module';
import { SearchModule } from './modules/search/search.module';
import { SitesModule } from './modules/sites/sites.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { SurveillanceTypeModule } from './modules/surveillance-type/surveillance-type.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';
import { VisitSchedulerModule } from './modules/visits/visit-scheduler/visit-scheduler.module';
import { VisitModule } from './modules/visits/visits.module';
import { SeederModule } from './seeder/seederModule';
import { HealthModule } from './modules/health/health.module';
import { GeoLensModule } from './modules/geolens/geolens.module';
import { MlModule } from './modules/ml/ml.module';
import { SequencingModule } from './modules/sequencing/sequencing.module';
import { SequencingJob } from './entities/sequencing-job.entity';
import { SequencingSubmission } from './entities/sequencing-submission.entity';
import { PurgeModule } from './modules/purge/purge.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { DataImportModule } from './modules/data-import/data-import.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    // Per-IP rate limiting, applied to AuthController's OTP send/verify
    // routes only (@UseGuards(ThrottlerGuard) there) - not registered as a
    // global APP_GUARD, so unrelated routes elsewhere are unaffected.
    // In-memory storage: confirmed single-instance deployment
    // (docker-compose.yml has no replicas, and container_name: backend is a
    // fixed name that would collide on scale-up). A Redis-backed throttler
    // storage is the upgrade path if that ever changes.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    RedisCacheModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          Otp,
          User,
          Project,
          Role,
          Permission,
          Disease,
          Site,
          SurveillanceType,
          Media,
          Visit,
          Sample,
          SampleType,
          Species,
          Invite,
          Location,
          Team,
          Region,
          UserRole,
          LabTest,
          SampleAudit,
          Kit,
          BioWetland,
          BioPoultryFarm,
          BioWaterBoundary,
          BioCattleMarket,
          SequencingJob,
          SequencingSubmission,
          PipelineWebhookDelivery,
          PipelineVariant,
          AnimalMetadata,
          Workspace,
        ],
        synchronize: configService.get<string>('NODE_ENV') === 'development', // Auto-sync schema in development only
        logging: false,
        ssl: (() => {
          const nodeEnv = configService.get<string>('NODE_ENV');
          const dbSsl = configService.get<string>('DB_SSL');
          const dbHost = configService.get<string>('DB_HOST') || '';

          if (dbSsl === 'true') return { rejectUnauthorized: false };
          if (dbSsl === 'false') return false;

          const isProdOrStaging =
            nodeEnv === 'production' || nodeEnv === 'staging';
          const isRds = dbHost.includes('rds.amazonaws.com');

          return isProdOrStaging || isRds
            ? { rejectUnauthorized: false }
            : false;
        })(),
        extra: {
          // Unconfigured node-postgres pools default to max: 10, which is
          // exhausted well before 50 concurrent users. Tunable per-environment
          // via env vars so ops can adjust to the actual RDS instance class
          // without a code change.
          max: configService.get<number>('DB_POOL_MAX', 20),
          min: configService.get<number>('DB_POOL_MIN', 2),
          idleTimeoutMillis: configService.get<number>(
            'DB_POOL_IDLE_TIMEOUT_MS',
            30000,
          ),
          connectionTimeoutMillis: configService.get<number>(
            'DB_POOL_CONN_TIMEOUT_MS',
            5000,
          ),
          // Fail a runaway query instead of holding a pool connection forever.
          statement_timeout: configService.get<number>(
            'DB_STATEMENT_TIMEOUT_MS',
            15000,
          ),
        },
        // migrationsRun: true
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads', // Directory where files will be stored temporarily
    }),
    HealthModule,
    VisitSchedulerModule,
    AuthModule,
    UsersModule,
    OtpModule,
    ProjectsModule,
    InvitesModule,
    PermissionsModule,
    RolesModule,
    AccessModule,
    MailerModule,
    CaslModule,
    AuthorizationModule,
    DiseaseModule,
    SitesModule,
    VisitModule,
    SurveillanceTypeModule,
    LocationModule,
    SeederModule,
    SpeciesModule,
    SampleTypeModule,
    SamplesModule,
    RegionModule,
    TeamsModule,
    LabTestsModule,
    MediaModule,
    StatisticsModule,
    KitModule,
    SearchModule,
    GeoLensModule,
    MlModule,
    SequencingModule,
    PurgeModule,
    WorkspacesModule,
    DataImportModule,
  ],
  providers: [
    // Authentication is on by default for every route; opt out with @Public().
    // PoliciesGuard stays per-controller, since it needs @CheckPolicies metadata.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
