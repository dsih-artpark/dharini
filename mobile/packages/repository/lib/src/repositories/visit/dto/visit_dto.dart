import 'package:freezed_annotation/freezed_annotation.dart';

part 'visit_dto.freezed.dart';
part 'visit_dto.g.dart';

@freezed
class VisitDto with _$VisitDto {
  const factory VisitDto({
    String? id,
    String? projectId,
    String? siteId,
    String? questionSetId,
    List<String>? sampleIds,
    DateTime? visitDateTime,
    DateTime? visitScheduleDateTime,
    @Default('upcoming') String visitStatus,
    List<String>? collectorIds,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _VisitDto;

  factory VisitDto.fromJson(Map<String, dynamic> json) =>
      _$VisitDtoFromJson(json);
}
