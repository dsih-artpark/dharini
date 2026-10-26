import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Disease } from 'src/entities/disease.entity';
import { Region } from 'src/entities/region.entity';
import { SampleType } from 'src/entities/sample-type.entity';
import { SurveillanceType } from 'src/entities/surveillance-type.entity';
import { UserRole } from 'src/entities/user-role.entity';
import { User } from 'src/entities/user.entity';

export class UserResponseDto extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'email',
]) {}

export class SurveillanceTypeResponseDto extends PickType(SurveillanceType, [
  'id',
  'name',
]) {}

export class SampleTypeResponseDto extends PickType(SampleType, [
  'id',
  'name',
  'emojiIcon',
  'diseaseShortNames',
]) {
  @ApiPropertyOptional({ type: () => SurveillanceTypeResponseDto })
  @Type(() => SurveillanceTypeResponseDto)
  surveillanceType?: SurveillanceTypeResponseDto;
}

export class DiseaseResponseDto extends PickType(Disease, [
  'id',
  'name',
  'shortName',
  'index',
]) {}

export class UserRoleResponseDto extends PickType(UserRole, [
  'id',
  'team',
  'project',
  'role',
]) {}
export class UserWithRoleResponseDto extends PickType(User, [
  'id',
  'firstName',
  'lastName',
  'email',
]) {
  @Type(() => UserRoleResponseDto)
  roles: UserRoleResponseDto[];
}

export class ParentRegionResponseDto extends PickType(Region, [
  'id',
  'regionType',
  'name',
]) {}

export class RegionResponseDto extends PickType(Region, ['id', 'name']) {
  @Type(() => ParentRegionResponseDto)
  parentRegion?: ParentRegionResponseDto;
}
