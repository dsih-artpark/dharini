import 'package:domain/domain.dart';

import '../../../mappers/entity_mappers.dart';
import 'project_dto.dart';

class ProjectMapper implements EntityMapper<Project, ProjectDto> {
  const ProjectMapper();

  @override
  Project toDomain(ProjectDto dto) => Project(
        id: dto.id,
        name: dto.name,
        code: dto.code,
        email: dto.email,
        projectAdminIds: dto.projectAdminIds,
        diseaseIds: dto.diseaseIds,
        surveillanceTypeIds: dto.surveillanceTypeIds,
        locationIds: dto.locationIds,
        logisticDetails: dto.logisticDetails,
        processDetail: dto.processDetail,
        siteIds: dto.siteIds,
        memberIds: dto.memberIds,
        visitIds: dto.visitIds,
        isOnboardingCompleted: dto.isOnboardingCompleted,
        status:
            dto.status != null ? StatusType.values.byName(dto.status!) : null,
        createdById: dto.createdById,
        updatedById: dto.updatedById,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      );

  @override
  ProjectDto toDto(Project entity) => ProjectDto(
        id: entity.id,
        name: entity.name,
        code: entity.code,
        email: entity.email,
        projectAdminIds: entity.projectAdminIds,
        diseaseIds: entity.diseaseIds,
        surveillanceTypeIds: entity.surveillanceTypeIds,
        locationIds: entity.locationIds,
        logisticDetails: entity.logisticDetails,
        processDetail: entity.processDetail,
        siteIds: entity.siteIds,
        memberIds: entity.memberIds,
        visitIds: entity.visitIds,
        isOnboardingCompleted: entity.isOnboardingCompleted,
        status: entity.status?.name,
        createdById: entity.createdById,
        updatedById: entity.updatedById,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      );

  @override
  List<Project> toDomainList(List<ProjectDto> dtos) =>
      dtos.map(toDomain).toList();

  @override
  List<ProjectDto> toDtoList(List<Project> entities) =>
      entities.map(toDto).toList();
}
