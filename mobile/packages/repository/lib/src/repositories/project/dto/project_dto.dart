import 'package:freezed_annotation/freezed_annotation.dart';

part 'project_dto.freezed.dart';
part 'project_dto.g.dart';

@freezed
class ProjectDto with _$ProjectDto {
  const factory ProjectDto({
    required String id,
    required String name,
    required String code,
    required String email,
    List<String>? projectAdminIds,
    List<String>? diseaseIds,
    List<String>? surveillanceTypeIds,
    List<String>? locationIds,
    List<String>? logisticDetails,
    String? processDetail,
    List<String>? siteIds,
    List<String>? memberIds,
    List<String>? visitIds,
    @Default(false) bool isOnboardingCompleted,
    String? status,
    String? createdById,
    String? updatedById,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _ProjectDto;

  factory ProjectDto.fromJson(Map<String, dynamic> json) =>
      _$ProjectDtoFromJson(json);
}
