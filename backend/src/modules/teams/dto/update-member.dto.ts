// create-user.dto.ts
import {
  ApiHideProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsOptional()
  role?: any;

  @IsOptional()
  email?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Contact number of the recipient',
    example: '83340234',
  })
  @IsString()
  @IsOptional()
  contactNumber?: string;

  @ApiHideProperty()
  members?: any[];

  @ApiHideProperty()
  memberId?: string;

  @ApiHideProperty()
  teamId?: string;

  // Populated from the route's `:projectId` (controllers spread
  // `@Param() params` over the DTO), not from the request body. Used to
  // verify the target team actually belongs to the CASL-validated project
  // before any write - see teams.service.ts#updateTeamMember.
  @ApiHideProperty()
  projectId?: string;
}
