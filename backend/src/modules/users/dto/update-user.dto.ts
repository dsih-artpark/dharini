import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @ApiPropertyOptional({
    description: 'Profile picture',
    example: 'profilePicture',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
