import 'package:freezed_annotation/freezed_annotation.dart';

part 'invite_dto.freezed.dart';
part 'invite_dto.g.dart';

@freezed
class InviteDto with _$InviteDto {
  const factory InviteDto({
    required String id,
    String? invitedById,
    String? inviteeType,
    String? organizationName,
    String? firstName,
    String? lastName,
    String? organizationType,
    String? email,
    String? contactNumber,
    String? projectId,
    String? inviteToken,
    DateTime? expirationDate,
    @Default(false) bool accepted,
    String? userType,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _InviteDto;

  factory InviteDto.fromJson(Map<String, dynamic> json) =>
      _$InviteDtoFromJson(json);
}
