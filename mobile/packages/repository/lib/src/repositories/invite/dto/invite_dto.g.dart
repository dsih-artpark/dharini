// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invite_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$InviteDtoImpl _$$InviteDtoImplFromJson(Map<String, dynamic> json) =>
    _$InviteDtoImpl(
      id: json['id'] as String,
      invitedById: json['invitedById'] as String?,
      inviteeType: json['inviteeType'] as String?,
      organizationName: json['organizationName'] as String?,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      organizationType: json['organizationType'] as String?,
      email: json['email'] as String?,
      contactNumber: json['contactNumber'] as String?,
      projectId: json['projectId'] as String?,
      inviteToken: json['inviteToken'] as String?,
      expirationDate: json['expirationDate'] == null
          ? null
          : DateTime.parse(json['expirationDate'] as String),
      accepted: json['accepted'] as bool? ?? false,
      userType: json['userType'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$InviteDtoImplToJson(_$InviteDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'invitedById': instance.invitedById,
      'inviteeType': instance.inviteeType,
      'organizationName': instance.organizationName,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'organizationType': instance.organizationType,
      'email': instance.email,
      'contactNumber': instance.contactNumber,
      'projectId': instance.projectId,
      'inviteToken': instance.inviteToken,
      'expirationDate': instance.expirationDate?.toIso8601String(),
      'accepted': instance.accepted,
      'userType': instance.userType,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
