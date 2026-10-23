import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:schema_validation/schema_validation.dart';

import 'user_status.dart';
import 'user_type.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
@GenerateSchema()
@includeInBarrelFile
class User with _$User, Validatable {
  const factory User({
    @Validate(required: true, pattern: 'ValidationPatterns.uuid')
    required String id,
    String? firstName,
    String? lastName,
    String? designation,
    String? contactNumber,
    String? address,
    @Validate(pattern: 'ValidationPatterns.email') String? email,
    String? otp,
    UserType? userType,
    StatusType? status,
    DateTime? createdAt,
    DateTime? updatedAt,

    // Relationships - these would need to be properly modeled based on your needs
    List<String>? roleIds,
    List<String>? visitIds,
    String? organizationId,
    List<String>? projectIds,
    String? projectId,
    List<String>? siteIds,
  }) = _User;

  const User._();

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  @override
  // ignore: strict_raw_type, always_specify_types
  Schema get schema => userSchema;
}
