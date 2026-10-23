import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { CreateCollectionPlanObj } from 'src/common/types/create-collectionplan-obj.type';
import { CreateSiteObj } from 'src/common/types/create-site-obj.type';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  ExploreSitesResponse,
  GetSiteOnDiseaseResponse,
  ListNearbySiteResponse,
  ListSiteResponse,
  MostPositiveSiteResponse,
  SiteResponse,
} from '../../common/dto/response/site.response';
import { ProjectsService } from '../projects/projects.service';
import { calculateExpiryDateFlexible } from './calExpiryDate';
import { calculateStartDate } from './calStartDate';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SitesService } from './sites.service';
import { DateTime } from 'luxon';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// None of this controller's routes carry a `:projectId`/`:workspaceId` route
// param (the live, project-scoped site routes live under
// `/projects/:projectId/sites/**` in ProjectsController instead) - every
// method here resolves its own tenant scope from the caller's `user_roles`
// via `TenantScopeService`/`applyProjectScope` inside SitesService, or binds
// to an explicit `projectId` argument the caller passes in. See
// FINDINGS.md §21e / FIX-PLAN A13.
@ServiceScoped(
  'SitesService resolves tenant scope internally (TenantScopeService/applyProjectScope) or binds to an explicit projectId argument; no route here carries :projectId',
)
@Controller('sites')
export class SitesController {
  constructor(
    private readonly siteService: SitesService,
    private readonly projectService: ProjectsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: SiteResponse,

    exposeDefaultValues: true,
  })
  // @Post()
  async create(
    @Body() createSiteDto: CreateSiteDto,
    @Req() req,
  ): Promise<SiteResponse> {
    try {
      const { user } = req;
      const {
        project,
        photos,
        collectionCollector,
        collectionTime,
        ...createSiteObj
      } = createSiteDto;
      const collectionObj: CreateCollectionPlanObj = {
        collectionCollector: null,
        collectionStartDate: null,
        collectionExpiryDate: null,
        collectionTime: collectionTime || null,
      };

      const projectData = await this.projectService.findOne({ id: project });
      if (!projectData) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      const diseasesData = projectData.diseases;
      if (!diseasesData) {
        throw new HttpException('Disease not found', HttpStatus.NOT_FOUND);
      }
      let collector = null;
      if (collectionCollector) {
        collector = await this.userRepository.findOne({
          where: { id: collectionCollector },
        });
        collectionObj.collectionCollector = collector;
      }

      if (collectionCollector && !collector) {
        throw new HttpException('Collector not found', HttpStatus.NOT_FOUND);
      }

      let createdBy: User = null;
      if (user && user.id) {
        createdBy = await this.userRepository.findOne({
          where: { id: user.id },
        });
        if (!createdBy) {
          throw new HttpException(
            `User not found for userid ${user.id}`,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // Use user-provided collectionStartDate if present, otherwise calculate it
      if (createSiteObj.collectionStartDate) {
        // User provided a start date from the frontend (YYYY-MM-DD or ISO string)
        // Parse as UTC midnight to ensure consistent date handling across timezones
        const parsedDate = DateTime.fromISO(
          createSiteObj.collectionStartDate instanceof Date
            ? createSiteObj.collectionStartDate.toISOString()
            : (createSiteObj.collectionStartDate as unknown as string),
          {
            zone: 'utc',
          },
        );
        collectionObj.collectionStartDate = parsedDate
          .startOf('day')
          .toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      } else if (collectionTime && createSiteObj.collectionDayOfWeek) {
        // Fallback: calculate start date if not provided
        collectionObj.collectionStartDate = calculateStartDate(
          createSiteObj.collectionDayOfWeek,
          collectionObj.collectionTime,
        );
        collectionObj.collectionStartDate = DateTime.fromJSDate(
          collectionObj.collectionStartDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }
      if (createSiteObj.collectionDuration) {
        collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
          createSiteObj.collectionDuration,
          collectionObj.collectionTime,
        );
        collectionObj.collectionExpiryDate = DateTime.fromJSDate(
          collectionObj.collectionExpiryDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }

      const site = await this.siteService.create(
        { ...createSiteObj } as CreateSiteObj,
        projectData,
        diseasesData,
        collectionObj,
        createdBy,
        photos,
      );

      const signedUrls = await this.siteService.getSignedUrlForSingleSite(site);
      site.photos = signedUrls;

      return {
        success: true,
        message: 'Site created successfully',
        data: site,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while creating the site',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ExploreSitesResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'regionId', required: false, type: String, example: '123' })
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'Foot & Mouth Disease',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'surveillanceType',
    required: false,
    type: String,
    example: 'Active Surveillance',
  })
  // @Get('explore-sites')
  async exploreSites(@Req() req): Promise<ExploreSitesResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };
    const site = await this.siteService.exploreSites({ ...query, user });
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site as unknown as ExploreSitesResponse['data'],
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: GetSiteOnDiseaseResponse,

    exposeDefaultValues: true,
  })
  // @Get('site-sample-report/weekly-update')
  async getSiteOnDisease(@Req() req): Promise<GetSiteOnDiseaseResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };

    const site = await this.siteService.getSiteOnDisease(query, user);
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: SiteResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'diseaseId',
    required: false,
    type: String,
    example: '1234567',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2024-12-31',
  })
  // @Get('most-positive-sites')
  async getMostPositive(@Req() req): Promise<MostPositiveSiteResponse> {
    const { user } = req;
    const query = {
      ...req.query,
    };

    const site = await this.siteService.getMostPositive(query, user);
    return {
      success: true,
      message: 'Sites statistics fetched successfully',
      data: site,
    };
  }

  // `sites-disease-trends` / getSiteByDiseaseTrends removed (FINDINGS.md
  // §21f, FIX-PLAN C8): its `where: { id: user?.project?.id }` silently
  // dropped the tenant predicate for every non-legacy-project user and
  // returned an arbitrary project's data. The route was already commented
  // out and unused, so it was deleted outright rather than left as a
  // landmine for whoever revives it.

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ListSiteResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({ name: 'project', required: false, type: String, example: '123' })
  @ApiQuery({
    name: 'testResult',
    required: false,
    type: String,
    example: 'positive',
  })
  @ApiQuery({ name: 'disease', required: false, type: String, example: '1' })
  @ApiQuery({
    name: 'siteType',
    required: false,
    type: String,
    example: 'private',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    example: 'newest',
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
    type: Number,
    example: 17.385,
    description: 'Latitude of the location',
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
    type: Number,
    example: 78.4867,
    description: 'Longitude of the location',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: Boolean,
    example: 'true',
  })
  @ApiQuery({
    name: 'farmType',
    required: false,
    type: String,
    example: 'poultry farm',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'ABC Site',
  })
  @Get()
  async findAll(@Req() req): Promise<ListSiteResponse> {
    try {
      const { user } = req;
      const query = {
        ...req.query,
      };
      const site = await this.siteService.findAll(query, user);

      return {
        success: true,
        message: 'Sites fetched successfully',
        data: site,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error,
        // 'An error occurred while fetching sites',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ListSiteResponse,

    exposeDefaultValues: true,
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: Number,
    example: 17.385,
    description: 'Latitude of the location',
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: Number,
    example: 78.4867,
    description: 'Longitude of the location',
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: Boolean,
    example: 'true',
  })
  @ApiQuery({
    name: 'radius',
    required: true,
    type: Number,
    example: 1000,
    description: 'Radius in meters to search for nearby sites',
  })
  @ApiQuery({
    name: 'filterBy',
    required: false,
    type: String,
    example: 'newest',
    description: 'Filter the sites by newest or status',
  })
  @ApiQuery({
    name: 'farmType',
    required: false,
    type: String,
    isArray: true,
    example: ['poultry farm', 'cattle farm'],
    description: 'Filter sites by farm type',
  })
  // @Get('nearby')
  async getNearbyLocations(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('assignedTo') assignedTo: string,
    @Query('radius') radius: number,
    @Req() req,
  ): Promise<ListNearbySiteResponse> {
    const { user } = req;
    const sites = await this.siteService.getNearbySites(
      req?.query,
      latitude,
      longitude,
      radius,
      user,
      assignedTo,
    );
    return {
      success: true,
      message: 'Fetch sites successfully',
      data: sites,
    };
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: SiteResponse,

    exposeDefaultValues: true,
  })
  // @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Site UUID' })
  async findOne(@Param('id') id: string, @Req() req): Promise<SiteResponse> {
    const { user } = req;
    console.log(user);
    try {
      const { site, photos, nextCollectionDate } =
        await this.siteService.findOne({ id });
      return {
        success: true,
        message: 'Site fetched successfully',
        data: { ...site, photos, nextCollectionDate },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while fetching the site',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'site'))
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: SiteResponse,

    exposeDefaultValues: true,
  })
  // @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'Site UUID' })
  async update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @Req() req,
  ): Promise<SiteResponse> {
    try {
      const { user } = req;
      const { collectionCollector, photos, collectionTime, ...updateSiteObj } =
        updateSiteDto;

      const collectionObj: CreateCollectionPlanObj = {
        collectionStartDate: null,
        collectionExpiryDate: null,
        collectionTime: collectionTime || null,
      };

      let collector = null;
      if (collectionCollector) {
        collector = await this.userRepository.findOne({
          where: { id: collectionCollector },
        });
      }
      if (!collector && collectionCollector) {
        throw new HttpException('Collector not found', HttpStatus.NOT_FOUND);
      }

      let updatedBy: User = null;
      if (user && user.id) {
        updatedBy = await this.userRepository.findOne({
          where: { id: user.id },
        });
        if (!updatedBy) {
          throw new HttpException(
            `User not found for userid ${user.id}`,
            HttpStatus.NOT_FOUND,
          );
        }
      }
      // Use user-provided collectionStartDate if present, otherwise calculate it
      if (updateSiteObj.collectionStartDate) {
        const parsedDate = DateTime.fromISO(
          updateSiteObj.collectionStartDate instanceof Date
            ? updateSiteObj.collectionStartDate.toISOString()
            : (updateSiteObj.collectionStartDate as unknown as string),
          {
            zone: 'utc',
          },
        );
        collectionObj.collectionStartDate = parsedDate
          .startOf('day')
          .toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      } else if (collectionTime && updateSiteObj.collectionDayOfWeek) {
        collectionObj.collectionStartDate = calculateStartDate(
          updateSiteObj.collectionDayOfWeek,
          collectionTime,
        );
        collectionObj.collectionStartDate = DateTime.fromJSDate(
          collectionObj.collectionStartDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }
      if (updateSiteObj.collectionDuration) {
        collectionObj.collectionExpiryDate = calculateExpiryDateFlexible(
          updateSiteObj.collectionDuration,
          collectionTime,
        );
        collectionObj.collectionExpiryDate = DateTime.fromJSDate(
          collectionObj.collectionExpiryDate,
        ).toFormat('yyyy-MM-dd HH:mm:ss') as unknown as Date;
      }

      const site = await this.siteService.update(
        id,
        collector,
        updateSiteObj,
        collectionObj,
        updatedBy,
        photos,
      );

      const signedUrls = await this.siteService.getSignedUrlForSingleSite(site);
      site.photos = signedUrls;

      return {
        success: true,
        message: 'Site updated successfully',
        data: site,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while updating the site',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
