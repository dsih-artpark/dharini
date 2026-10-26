import {
  Body,
  Controller,
  Param,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ServiceScoped } from 'src/common/decorators/tenant-scope.decorator';
import { ListLabTestResponse } from 'src/common/dto/response/lab-test.response';
import { CreateMultipleLabTestDto } from './dto/create-lab-test.dto';
import { FetchAllLabTestResponse } from './dto/response.dto';
import { UpdateMultipleLabTestDto } from './dto/update-lab-test.dto';
import { LabTestsService } from './lab-tests.service';

@Controller('lab-tests')
// This flat controller has no @UseGuards and every route is commented out -
// the live routes are nested under /projects/:projectId/... in
// projects.controller.ts (and duplicated, also dead, on samples.controller.ts).
// Annotated for when/if this controller is reconnected: none of its routes
// carry a :projectId, so the ability factory's context-less fallback would
// deny them outright without this. findOne/findAll now also accept an
// explicit projectId to bind the leaf lab-test to its route's project - see
// lab-tests.service.ts.
@ServiceScoped(
  'caller-supplied projectId filtered in LabTestsService; no :projectId on this flat route',
)
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) {}

  // @Post()
  async create(
    @Body() createMultipleLabTestDto: CreateMultipleLabTestDto,
  ): Promise<ListLabTestResponse> {
    const labTest = await this.labTestsService.create(createMultipleLabTestDto);
    return {
      success: true,
      message: 'Lab test created successfully',
      data: labTest,
    };
  }

  // @Get()
  @SerializeOptions({ type: FetchAllLabTestResponse })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: String,
    example: 'Project UUID',
  })
  @ApiQuery({
    name: 'disease',
    required: false,
    type: String,
    example: 'disease UUID',
  })
  @ApiQuery({
    name: 'siteId',
    required: false,
    type: String,
    example: 'Site UUID',
  })
  async findAll(@Query() query): Promise<FetchAllLabTestResponse> {
    const labTests = await this.labTestsService.findAll(query);
    return {
      success: true,
      message: 'Lab tests fetched successfully',
      data: labTests,
    };
  }

  // @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestsService.findOne(+id);
  }

  // @Patch('')
  async update(
    @Param('id') id: string,
    @Body() updateLabTestDto: UpdateMultipleLabTestDto,
  ): Promise<ListLabTestResponse> {
    const labTests = await this.labTestsService.update(updateLabTestDto);
    return {
      success: true,
      message: 'Lab tests fetched successfully',
      data: labTests,
    };
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestsService.remove(+id);
  }
}
