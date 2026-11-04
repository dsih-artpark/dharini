import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// 3.3: self-service "first-run details" update. Deliberately excludes
// id/role/scope/email/contactNumber — the target is always the caller's
// own req.user.id (see UserController.updateProfile), never a body/param
// -supplied id, so there is no privilege-escalation surface here.
export class UpdateOwnProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  designation?: string;
}
