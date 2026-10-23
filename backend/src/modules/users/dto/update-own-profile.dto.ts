import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// 3.3: self-service "first-run details" update. Deliberately excludes
// id/role/scope/email/contactNumber — the target is always the caller's
// own req.user.id (see UserController.updateProfile), never a body/param
// -supplied id, so there is no privilege-escalation surface here.
export class UpdateOwnProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  designation?: string;
}
