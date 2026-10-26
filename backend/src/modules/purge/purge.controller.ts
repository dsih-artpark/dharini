import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { PurgeService } from './purge.service';

@ApiTags('Purge')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('purge')
export class PurgeController {
  constructor(private readonly purgeService: PurgeService) {}

  // sample/visit/site purges take a leaf resource id, not :projectId, so
  // AbilityFactory can't scope them by route param alone (FIX-PLAN A4).
  // @ServiceScoped documents that PurgeService itself resolves the target's
  // owning project and requires System scope or canReachProject() before
  // deleting anything — see PurgeService.assertCanPurgeProject.
  @Delete('sample/:sampleId')
  @ApiOperation({
    summary: 'Purge a sample and all its cascading dependencies',
  })
  @ApiParam({
    name: 'sampleId',
    type: String,
    description: 'Sample UUID',
  })
  @ServiceScoped(
    "PurgeService.deleteSample resolves the sample's owning project and requires System scope or canReachProject()",
  )
  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'sample'))
  async deleteSample(
    @Param('sampleId', ParseUUIDPipe) sampleId: string,
    @Req() req,
  ) {
    await this.purgeService.deleteSample(sampleId, req.user);
    return {
      success: true,
      message: 'Sample and related data purged successfully',
    };
  }

  @Delete('visit/:visitId')
  @ApiOperation({ summary: 'Purge a visit and all its cascading dependencies' })
  @ApiParam({ name: 'visitId', type: String, description: 'Visit UUID' })
  @ServiceScoped(
    "PurgeService.deleteVisit resolves the visit's owning project and requires System scope or canReachProject()",
  )
  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'visit'))
  async deleteVisit(
    @Param('visitId', ParseUUIDPipe) visitId: string,
    @Req() req,
  ) {
    await this.purgeService.deleteVisit(visitId, req.user);
    return {
      success: true,
      message: 'Visit and related data purged successfully',
    };
  }

  @Delete('site/:siteId')
  @ApiOperation({ summary: 'Purge a site and all its cascading dependencies' })
  @ApiParam({ name: 'siteId', type: String, description: 'Site UUID' })
  @ServiceScoped(
    "PurgeService.deleteSite resolves the site's owning project and requires System scope or canReachProject()",
  )
  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'site'))
  async deleteSite(@Param('siteId', ParseUUIDPipe) siteId: string, @Req() req) {
    await this.purgeService.deleteSite(siteId, req.user);
    return {
      success: true,
      message: 'Site and related data purged successfully',
    };
  }

  // :projectId (renamed from :id) is what re-engages AbilityFactory's normal
  // project/workspace scoping for this route "for free" - no @ServiceScoped
  // needed here. PurgeService.deleteProject still re-checks at the service
  // layer as well (belt-and-suspenders; the ability factory is owned/wired
  // by a different lane).
  @Delete('project/:projectId')
  @ApiOperation({
    summary: 'Purge a project and all its cascading dependencies',
  })
  @ApiParam({
    name: 'projectId',
    type: String,
    description: 'Project ID',
  })
  @CheckPolicies((ability: AppAbility) => ability.can('manage', 'project'))
  async deleteProject(@Param('projectId') projectId: string, @Req() req) {
    await this.purgeService.deleteProject(projectId, req.user);
    return {
      success: true,
      message: 'Project and related data purged successfully',
    };
  }
}
