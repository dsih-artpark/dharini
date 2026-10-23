import 'package:freezed_annotation/freezed_annotation.dart';

part 'site_dto.freezed.dart';
part 'site_dto.g.dart';

@freezed
class SiteDto with _$SiteDto {
  const factory SiteDto({
    required String id,
    required String name,
    String? projectId,
    String? diseaseId,
    int? collectionFrequencyInterval,
    int? collectionFrequency,
    List<String>? collectionDayOfWeek,
    String? collectionTime,
    DateTime? collectionStartDate,
    DateTime? collectionLastScheduleDate,
    int? collectionDuration,
    List<String>? collectionCollectorIds,
    DateTime? collectionExpiryDate,
    List<String>? photos,
    List<String>? visitIds,
    List<String>? sampleIds,
    String? farmType,
    String? siteType,
    String? siteOwnerName,
    String? siteOwnerNumber,
    int? workerNumber,
    String? address,
    String? district,
    String? state,
    int? pinCode,
    double? latitude,
    double? longitude,
    String? comment,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _SiteDto;

  factory SiteDto.fromJson(Map<String, dynamic> json) =>
      _$SiteDtoFromJson(json);
}
