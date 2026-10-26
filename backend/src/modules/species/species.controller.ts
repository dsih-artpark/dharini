import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { SpeciesService } from './species.service';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import {
  SpeciesResponse,
  ListSpeciesResponse,
} from 'src/common/dto/response/species.response';

@ApiTags('species')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'species'))
  @ApiOperation({ summary: 'Create a new species' })
  @SerializeOptions({ type: SpeciesResponse, exposeDefaultValues: true })
  async create(
    @Body() createSpeciesDto: CreateSpeciesDto,
  ): Promise<SpeciesResponse> {
    const species = await this.speciesService.create(createSpeciesDto);
    return {
      success: true,
      message: 'Species created successfully',
      data: species as any,
    };
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'species'))
  @ApiOperation({ summary: 'Get all active species' })
  @SerializeOptions({ type: ListSpeciesResponse, exposeDefaultValues: true })
  async findAll(): Promise<ListSpeciesResponse> {
    const species = await this.speciesService.findAll();
    return {
      success: true,
      message: 'Species fetched successfully',
      data: species as any,
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'species'))
  @ApiOperation({ summary: 'Get a species by id' })
  @SerializeOptions({ type: SpeciesResponse, exposeDefaultValues: true })
  async findOne(@Param('id') id: string): Promise<SpeciesResponse> {
    const species = await this.speciesService.findOne(id);
    return {
      success: true,
      message: 'Species fetched successfully',
      data: species as any,
    };
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'species'))
  @ApiOperation({ summary: 'Update a species' })
  @SerializeOptions({ type: SpeciesResponse, exposeDefaultValues: true })
  async update(
    @Param('id') id: string,
    @Body() updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<SpeciesResponse> {
    const species = await this.speciesService.update(id, updateSpeciesDto);
    return {
      success: true,
      message: 'Species updated successfully',
      data: species as any,
    };
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'species'))
  @ApiOperation({ summary: 'Delete a species' })
  async remove(@Param('id') id: string) {
    await this.speciesService.remove(id);
    return {
      success: true,
      message: 'Species deleted successfully',
    };
  }
}
