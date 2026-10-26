// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserDtoImpl _$$UserDtoImplFromJson(Map<String, dynamic> json) =>
    _$UserDtoImpl(
      id: json['id'] as String,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      designation: json['designation'] as String?,
      contactNumber: json['contactNumber'] as String?,
      address: json['address'] as String?,
      email: json['email'] as String?,
      otp: json['otp'] as String?,
      userType: json['userType'] as String?,
      status: json['status'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      roleIds:
          (json['roleIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
      visitIds: (json['visitIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      organizationId: json['organizationId'] as String?,
      projectIds: (json['projectIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      projectId: json['projectId'] as String?,
      siteIds:
          (json['siteIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
    );

Map<String, dynamic> _$$UserDtoImplToJson(_$UserDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'designation': instance.designation,
      'contactNumber': instance.contactNumber,
      'address': instance.address,
      'email': instance.email,
      'otp': instance.otp,
      'userType': instance.userType,
      'status': instance.status,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'roleIds': instance.roleIds,
      'visitIds': instance.visitIds,
      'organizationId': instance.organizationId,
      'projectIds': instance.projectIds,
      'projectId': instance.projectId,
      'siteIds': instance.siteIds,
    };
