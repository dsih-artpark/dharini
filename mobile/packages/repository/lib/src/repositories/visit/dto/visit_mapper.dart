import 'package:domain/domain.dart';

import '../../../mappers/entity_mappers.dart';
import 'visit_dto.dart';

class VisitMapper implements EntityMapper<Visit, VisitDto> {
  const VisitMapper();

  @override
  Visit toDomain(VisitDto dto) => Visit(
        id: dto.id,
        projectId: dto.projectId,
        siteId: dto.siteId,
        questionSetId: dto.questionSetId,
        sampleIds: dto.sampleIds,
        visitDateTime: dto.visitDateTime,
        visitScheduleDateTime: dto.visitScheduleDateTime,
        visitStatus: VisitStatus.values.byName(dto.visitStatus),
        collectorIds: dto.collectorIds,
        status:
            dto.status != null ? StatusType.values.byName(dto.status!) : null,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      );

  @override
  VisitDto toDto(Visit entity) => VisitDto(
        id: entity.id,
        projectId: entity.projectId,
        siteId: entity.siteId,
        questionSetId: entity.questionSetId,
        sampleIds: entity.sampleIds,
        visitDateTime: entity.visitDateTime,
        visitScheduleDateTime: entity.visitScheduleDateTime,
        visitStatus: entity.visitStatus.name,
        collectorIds: entity.collectorIds,
        status: entity.status?.name,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      );

  @override
  List<Visit> toDomainList(List<VisitDto> dtos) => dtos.map(toDomain).toList();

  @override
  List<VisitDto> toDtoList(List<Visit> entities) =>
      entities.map(toDto).toList();
}
