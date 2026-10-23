import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:schema_validation/schema_validation.dart';

import '../user/user_status.dart';

part 'project.freezed.dart';
part 'project.g.dart';

@freezed
@GenerateSchema()
@includeInBarrelFile
class Project with _$Project, Validatable {
  const factory Project({
    @Validate(required: true, pattern: 'ValidationPatterns.uuid')
    required String id,
    @Validate(required: true) required String name,
    @Validate(required: true) required String code,
    @Validate(required: true, pattern: 'ValidationPatterns.email')
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
    StatusType? status,
    String? createdById,
    String? updatedById,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Project;

  const Project._();

  factory Project.fromJson(Map<String, dynamic> json) =>
      _$ProjectFromJson(json);

  @override
  // ignore: strict_raw_type, always_specify_types
  Schema get schema => projectSchema;
}
