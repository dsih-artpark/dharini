import 'package:barrel_files_annotation/barrel_files_annotation.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:schema_validation/schema_validation.dart';

import '../invite/invitee_type.dart';
import '../organisation/organisation_type.dart';
import '../user/user_type.dart';

part 'invite.freezed.dart';
part 'invite.g.dart';

@freezed
@GenerateSchema()
@includeInBarrelFile
class Invite with _$Invite, Validatable {
  const factory Invite({
    @Validate(required: true, pattern: 'ValidationPatterns.uuid')
    required String id,
    String? invitedById,
    InviteeType? inviteeType,
    String? organizationName,
    String? firstName,
    String? lastName,
    OrganizationType? organizationType,
    @Validate(pattern: 'ValidationPatterns.email') String? email,
    String? contactNumber,
    String? projectId,
    String? inviteToken,
    DateTime? expirationDate,
    @Default(false) bool accepted,
    UserType? userType,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Invite;

  const Invite._();

  factory Invite.fromJson(Map<String, dynamic> json) => _$InviteFromJson(json);

  @override
  // ignore: strict_raw_type, always_specify_types
  Schema get schema => inviteSchema;
}
