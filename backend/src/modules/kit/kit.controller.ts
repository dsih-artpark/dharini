import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/abitlity.factory';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { Action } from 'src/common/enums/action.enum';
import { PoliciesGuard } from 'src/common/guards/casl-policies.guard';
import { TenantAgnostic } from 'src/common/decorators/tenant-scope.decorator';
import {
  KitResponse,
  ListKitResponse,
} from 'src/common/dto/response/kit.response';
import { CreateKitDto } from './dto/create-kit.dto';
import { UpdateKitDto } from './dto/update-kit.dto';
import { KitService } from './kit.service';

@ApiBearerAuth()
@UseGuards(PoliciesGuard)
// Global reference data: owned by no workspace or project, so there is no
// tenant to scope against. Declared explicitly because PoliciesGuard now
// denies context-less routes that claim neither opt-in.
@TenantAgnostic()
@Controller('kits')
export class KitController {
  constructor(private readonly kitService: KitService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, 'kit'))
  async create(@Body() createKitDto: CreateKitDto): Promise<KitResponse> {
    const kit = await this.kitService.create(createKitDto);
    return {
      success: true,
      message: 'Kit created successfully',
      data: kit,
    };
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'kit'))
  async findAll(): Promise<ListKitResponse> {
    const kit = await this.kitService.findAll({});
    return {
      success: true,
      message: 'Kits fetched successfully',
      data: kit,
    };
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'kit'))
  async findOne(@Param('id') id: string): Promise<KitResponse> {
    const kit = await this.kitService.findOne({ id });
    return {
      success: true,
      message: 'Kit fetched successfully',
      data: kit,
    };
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'kit'))
  async update(
    @Param('id') id: string,
    @Body() updateKitDto: UpdateKitDto,
  ): Promise<KitResponse> {
    const kit = await this.kitService.update(id, updateKitDto);
    return {
      success: true,
      message: 'Kit updated successfully',
      data: kit,
    };
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<KitResponse> {
  //   const kit = await this.kitService.remove(id);
  //   return {
  //     success: true,
  //     message: 'Kit deleted successfully',
  //   }
  // }
}
