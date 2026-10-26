import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:schema_validation/schema_validation.dart';

import '../user/user_status.dart';
import 'visit_status.dart';

part 'visit.freezed.dart';
part 'visit.g.dart';

@freezed
@GenerateSchema()
@includeInBarrelFile
class Visit with _$Visit, Validatable {
  const factory Visit({
    @Validate(required: true, pattern: 'ValidationPatterns.uuid') String? id,
    String? projectId,
    String? siteId,
    @Validate(required: true) String? questionSetId,
    List<String>? sampleIds,
    DateTime? visitDateTime,
    @Validate(required: true) DateTime? visitScheduleDateTime,
    @Default(VisitStatus.upcoming) VisitStatus visitStatus,
    List<String>? collectorIds,
    StatusType? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Visit;

  const Visit._();

  factory Visit.fromJson(Map<String, dynamic> json) => _$VisitFromJson(json);

  @override
  // ignore: strict_raw_type, always_specify_types
  Schema get schema => visitSchema;
}
