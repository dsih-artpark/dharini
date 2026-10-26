import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @ApiProperty({
    description: 'Email',
    example: 'user@mail.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'First name',
    example: 'firstname',
  })
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'lastname',
  })
  @IsString()
  latsName?: string;

  @ApiProperty({
    description: 'Name of team',
    example: 'Team Ashit',
  })
  @IsString()
  teamName?: string;

  @ApiProperty({
    description: 'User name',
    example: 'ashit',
  })
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Role',
    example: 'team-admin',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'Primary means project viewer',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsNotEmpty()
  invitedBy: any;

  @IsNotEmpty()
  projectId: any;

  @IsNotEmpty()
  inviteToken?: string;

  inviteeType?: string;
}
