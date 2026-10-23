import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { TenantScopeService } from './tenant-scope.service';

/**
 * Global so any service can inject `TenantScopeService` without each feature
 * module re-importing it and re-registering the Project repository. Mirrors
 * how `CaslModule` already provides `AbilityFactory`.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [TenantScopeService],
  exports: [TenantScopeService],
})
export class AuthorizationModule {}
