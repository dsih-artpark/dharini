import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchResponse } from 'src/common/dto/response/search.response';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ServiceScoped(
    'SearchService.searchAll scopes projects/sites to the caller’s reachable projects via resolveTenantScope/applyProjectScope; diseases are global reference data',
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'project'))
  @ApiQuery({
    name: 'searchText',
    description: 'Site name and Project name to search',
    required: false,
    type: String,
    example: 'Project',
  })
  async globalSearch(
    @Req() req,
    @Query('searchText') searchText: string,
  ): Promise<SearchResponse> {
    const { user } = req;
    const searchDataList = await this.searchService.searchAll(
      { searchText },
      user,
    );
    return {
      success: true,
      message: 'Search data fetched successfully',
      data: searchDataList,
    };
  }
}
