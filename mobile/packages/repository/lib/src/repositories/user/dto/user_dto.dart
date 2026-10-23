import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_dto.freezed.dart';
part 'user_dto.g.dart';

@freezed
class UserDto with _$UserDto {
  const factory UserDto({
    required String id,
    String? firstName,
    String? lastName,
    String? designation,
    String? contactNumber,
    String? address,
    String? email,
    String? otp,
    String? userType,
    String? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? roleIds,
    List<String>? visitIds,
    String? organizationId,
    List<String>? projectIds,
    String? projectId,
    List<String>? siteIds,
  }) = _UserDto;

  factory UserDto.fromJson(Map<String, dynamic> json) =>
      _$UserDtoFromJson(json);
}

// Run: dart run build_runner build to generate the part files
