import { PickType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Disease as DiseaseEntity } from 'src/entities/disease.entity';
import { Kit as KitEntity } from 'src/entities/kit.entity';
import { LabTest as LabTestEntity } from 'src/entities/lab-test.entity';
import { Location as LocationEntity } from 'src/entities/location.entity';
import { Permission as PermissionEntity } from 'src/entities/permission.entity';
import { Project as ProjectEntity } from 'src/entities/project.entity';
import { Region as RegionEntity } from 'src/entities/region.entity';
import { Role as RoleEntity } from 'src/entities/role.entity';
import { SampleType as SampleTypeEntity } from 'src/entities/sample-type.entity';
import { Sample as SampleEntity } from 'src/entities/sample.entity';
import { Site as SiteEntity } from 'src/entities/site.entity';
import { SurveillanceType as SurveillanceTypeEntity } from 'src/entities/surveillance-type.entity';
import { Species as SpeciesEntity } from 'src/entities/species.entity';
import { Team as TeamEntity } from 'src/entities/team.entity';
import { UserRole as UserRoleEntity } from 'src/entities/user-role.entity';
import { User as UserEntity } from 'src/entities/user.entity';
import { Visit as VisitEntity } from 'src/entities/visit.entity';
import { Point } from 'typeorm';

export class Disease extends PickType(DiseaseEntity, [
  'id',
  'code',
  'name',
  'shortName',
  'index',
  'createdAt',
  'updatedAt',
  'status',
]) {}

export class DiseaseStatistics {
  diseaseShortName: string;
  totalSamples: number;
  positiveSamples: number;
}

export class Region extends PickType(RegionEntity, [
  'id',
  'regionType',
  'lgdCode',
  'localName',
  'name',
  'metaData',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class LocationCoordinates implements Point {
  coordinates: number[];
  type: 'Point';
}

export class Location extends PickType(LocationEntity, ['id']) {
  @Type(() => LocationCoordinates)
  coordinates?: LocationCoordinates;

  region?: SiteResponseRegion;
}

class SiteResponseParentRegion extends Region {}

class SiteResponseRegion extends Region {
  parentRegion?: SiteResponseParentRegion;
}

export class User extends PickType(UserEntity, [
  'id',
  'firstName',
  'lastName',
  'profilePicture',
  'designation',
  'contactNumber',
  'address',
  'email',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

// Strict allow-list rather than PickType: PickType copies class-transformer
// metadata only for the properties it picks, so the entity's @Exclude()s on
// status/createdBy/etc would not carry over and any extra key present on the
// loaded row would be serialized. Class-level @Exclude() + per-property
// @Expose() emits exactly these two fields whatever the source object holds.
@Exclude()
export class Workspace {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class UserRole extends PickType(UserRoleEntity, [
  'id',
  'team',
  'project',
  'status',
] as const) {
  // Declared here rather than picked from the entity: UserRoleEntity.workspace
  // carries @Exclude(), so it never reached the client, and every consumer
  // that tried to tell "which workspace is this role for?" silently saw
  // undefined. The web app's useIsWorkspaceAdmin() and its role-display filter
  // both depend on this, and both were dead as a result. Only id and name are
  // exposed - the entity's status/createdBy/etc stay excluded.
  @Expose()
  @Type(() => Workspace)
  workspace?: Workspace | null;
}

export class Role extends PickType(RoleEntity, [
  'id',
  'name',
  'scope',
  'type',
  'status',
  'createdAt',
  'updatedAt',
]) {}

export class Permission extends PickType(PermissionEntity, [
  'id',
  'scope',
  'action',
  'subject',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Project extends PickType(ProjectEntity, [
  'id',
  'name',
  'code',
  'isOnboardingCompleted',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Site extends PickType(SiteEntity, [
  'id',
  'name',
  'siteCode',
  'collectionConsent',
  'collectionFrequencyInterval',
  'collectionFrequency',
  'collectionDayOfWeek',
  'collectionTime',
  'collectionStartDate',
  'collectionLastScheduleDate',
  'collectionDuration',
  'collectionExpiryDate',
  'photos',
  'farmType',
  'siteSubType',
  'siteType',
  'siteOwnerName',
  'siteOwnerNumber',
  'workerNumber',
  'address',
  'pinCode',
  'comment',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Visit extends PickType(VisitEntity, [
  'id',
  'questionSetId',
  'visitStartedAt',
  'visitedAt',
  'visitScheduledAt',
  'visitStatus',
  'photos',
  'comment',
  'status',
  'isCompleted',
  'rescheduledFrom',
  'createdAt',
  'updatedAt',
] as const) {
  @Expose()
  @Type(() => User)
  visitedBy?: User;

  @Expose()
  @Type(() => User)
  collector?: User;
}

export class Sample extends PickType(SampleEntity, [
  'id',
  'sampleCode',
  'collectedAt',
  'quantity',
  'unit',
  'habitat',
  'conc',
  'collectionTime',
  'photos',
  'comment',
  'replicates',
  'barcode',
  'sampleStatus',
  'status',
  'createdAt',
  'updatedAt',
  'rejectReason',
  'receivedAt',
  'receivedVolumeValue',
  'receivedVolumeUnit',
  'receivedLabStorageDetails',
  'extractionDateTime',
  'extractionSampleUsedValue',
  'extractionSampleUsedUnit',
  'extractionSampleRemainingValue',
  'extractionSampleRemainingUnit',
  'extractionComments',
  'receivedBy',
  'extractedBy',
  'collectedBy',
  'reportGeneratedBy',
] as const) {
  originalSampleId?: string | null;
}

export class SurveillanceType extends PickType(SurveillanceTypeEntity, [
  'id',
  'name',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Species extends PickType(SpeciesEntity, [
  'id',
  'name',
  'emojiIcon',
  'diseaseShortNames',
  'abbreviation',
  'active',
  'createdAt',
  'updatedAt',
]) {}

export class SampleType extends PickType(SampleTypeEntity, [
  'id',
  'name',
  'emojiIcon',
  'diseaseShortNames',
  'status',
  'createdAt',
  'updatedAt',
]) {
  @Type(() => SurveillanceType)
  surveillanceType?: SurveillanceType;
}

export class LabTest extends PickType(LabTestEntity, [
  'id',
  'ctValue',
  'variant',
  'viralLoad',
  'kitOrProtocol',
  'labComment',
  'resultDate',
  'resultComment',
  'testResult',
  'testResultReport',
  'testedAt',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Team extends PickType(TeamEntity, [
  'id',
  'teamName',
  'address',
  'logo',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

export class Kit extends PickType(KitEntity, [
  'id',
  'name',
  'status',
  'createdAt',
  'updatedAt',
] as const) {}

class FileUploadResult {
  filename: string;
  uploaded: boolean;
  fileUrl?: string | null;
}

export class UploadMultipleFilesResponse {
  success: boolean;
  message: string;
  @Type(() => FileUploadResult)
  data: FileUploadResult[];
}
