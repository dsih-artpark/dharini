import { IsString } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  userId: string;

  @IsString()
  roleId: string;
}
