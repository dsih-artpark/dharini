import 'package:domain/domain.dart';

import '../../../mappers/entity_mappers.dart';
import 'site_dto.dart';

class SiteMapper implements EntityMapper<Site, SiteDto> {
  const SiteMapper();

  @override
  Site toDomain(SiteDto dto) => Site(
        id: dto.id,
        name: dto.name,
        projectId: dto.projectId,
        diseaseId: dto.diseaseId,
        collectionFrequencyInterval: dto.collectionFrequencyInterval,
        collectionFrequency: dto.collectionFrequency,
        collectionDayOfWeek: dto.collectionDayOfWeek
            ?.map((String day) => DayOfWeek.values.byName(day))
            .toList(),
        collectionTime: dto.collectionTime,
        collectionStartDate: dto.collectionStartDate,
        collectionLastScheduleDate: dto.collectionLastScheduleDate,
        collectionDuration: dto.collectionDuration,
        collectionCollectorIds: dto.collectionCollectorIds,
        collectionExpiryDate: dto.collectionExpiryDate,
        photos: dto.photos,
        visitIds: dto.visitIds,
        sampleIds: dto.sampleIds,
        farmType: dto.farmType,
        siteType: dto.siteType,
        siteOwnerName: dto.siteOwnerName,
        siteOwnerNumber: dto.siteOwnerNumber,
        workerNumber: dto.workerNumber,
        address: dto.address,
        district: dto.district,
        state: dto.state,
        pinCode: dto.pinCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
        comment: dto.comment,
        status:
            dto.status != null ? StatusType.values.byName(dto.status!) : null,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      );

  @override
  SiteDto toDto(Site entity) => SiteDto(
        id: entity.id,
        name: entity.name,
        projectId: entity.projectId,
        diseaseId: entity.diseaseId,
        collectionFrequencyInterval: entity.collectionFrequencyInterval,
        collectionFrequency: entity.collectionFrequency,
        collectionDayOfWeek: entity.collectionDayOfWeek
            ?.map((DayOfWeek day) => day.name)
            .toList(),
        collectionTime: entity.collectionTime,
        collectionStartDate: entity.collectionStartDate,
        collectionLastScheduleDate: entity.collectionLastScheduleDate,
        collectionDuration: entity.collectionDuration,
        collectionCollectorIds: entity.collectionCollectorIds,
        collectionExpiryDate: entity.collectionExpiryDate,
        photos: entity.photos,
        visitIds: entity.visitIds,
        sampleIds: entity.sampleIds,
        farmType: entity.farmType,
        siteType: entity.siteType,
        siteOwnerName: entity.siteOwnerName,
        siteOwnerNumber: entity.siteOwnerNumber,
        workerNumber: entity.workerNumber,
        address: entity.address,
        district: entity.district,
        state: entity.state,
        pinCode: entity.pinCode,
        latitude: entity.latitude,
        longitude: entity.longitude,
        comment: entity.comment,
        status: entity.status?.name,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      );

  @override
  List<Site> toDomainList(List<SiteDto> dtos) => dtos.map(toDomain).toList();

  @override
  List<SiteDto> toDtoList(List<Site> entities) => entities.map(toDto).toList();
}
