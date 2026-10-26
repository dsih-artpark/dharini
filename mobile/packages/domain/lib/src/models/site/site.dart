import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:schema_validation/schema_validation.dart';

import '../collection/day_of_week.dart';
import '../user/user_status.dart';

part 'site.freezed.dart';
part 'site.g.dart';

@freezed
@GenerateSchema()
@includeInBarrelFile
class Site with _$Site, Validatable {
  const factory Site({
    @Validate(required: true, pattern: 'ValidationPatterns.uuid')
    required String id,
    @Validate(required: true) required String name,
    String? projectId,
    String? diseaseId,
    int? collectionFrequencyInterval,
    int? collectionFrequency,
    List<DayOfWeek>? collectionDayOfWeek,
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
    StatusType? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Site;

  const Site._();

  factory Site.fromJson(Map<String, dynamic> json) => _$SiteFromJson(json);

  @override
  // ignore: strict_raw_type, always_specify_types
  Schema get schema => siteSchema;
}
