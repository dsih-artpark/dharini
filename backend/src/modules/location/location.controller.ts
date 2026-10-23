import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';
import { CommonResponse } from 'src/common/types/common-response.type';
import { Location } from 'src/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import {
  ListLocationResponse,
  LocationResponse,
} from 'src/common/dto/response/location.response';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'location'),
  )
  @SerializeOptions({ type: LocationResponse, exposeDefaultValues: true })
  async create(
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<LocationResponse> {
    let location = await this.locationService.getLocationByCoordinates(
      createLocationDto.latitude,
      createLocationDto.longitude,
    );
    if (!location) {
      location = await this.locationService.create(createLocationDto);
    }
    return {
      success: true,
      message: 'Location created successfully',
      data: location,
    };
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'location'))
  @SerializeOptions({ type: ListLocationResponse, exposeDefaultValues: true })
  async findAll(@Query() query): Promise<ListLocationResponse> {
    const location = await this.locationService.findAll(query ?? {});
    return {
      success: true,
      message: 'Locations fetched successfully',
      data: location,
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'location'))
  @ApiParam({ name: 'id', type: String, description: 'Location UUID' })
  @SerializeOptions({ type: LocationResponse, exposeDefaultValues: true })
  async findOne(@Param('id') id: string): Promise<LocationResponse> {
    const location = await this.locationService.findOne({ id });
    return {
      success: true,
      message: 'Location fetched successfully',
      data: location,
    };
    return;
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, 'location'),
  )
  @ApiParam({ name: 'id', type: String, description: 'Location UUID' })
  @SerializeOptions({ type: LocationResponse, exposeDefaultValues: true })
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<LocationResponse> {
    const location = await this.locationService.update(id, updateLocationDto);
    return {
      success: true,
      message: 'Location updated successfully',
      data: location,
    };
  }

  // @Delete('delete-location')
  async updateLocation(): Promise<CommonResponse<Location>> {
    const locations = await this.locationService.findAll({});
    for (const location of locations) {
      // if (location.lgdCode !== '438')
      await this.locationService.remove(location.id);
    }
    return {
      success: true,
      message: 'Location updated successfully',
    };
  }

  // @Delete(':id')
  async remove(@Param('id') id: string): Promise<CommonResponse<Location>> {
    const location = await this.locationService.remove(id);
    return {
      success: true,
      message: 'Location deleted successfully',
      data: location,
    };
  }

  @Post('import')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, 'location'),
  )
  @SerializeOptions({ type: ListLocationResponse, exposeDefaultValues: true })
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ListLocationResponse> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Pass the file path to the service
    const locations = await this.locationService.convertExcelToJson(
      file.buffer,
    );
    return {
      success: true,
      message: 'Locations imported successfully',
      data: locations,
    };
  }
}
