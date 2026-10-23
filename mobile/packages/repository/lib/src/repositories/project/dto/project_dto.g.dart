// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProjectDtoImpl _$$ProjectDtoImplFromJson(Map<String, dynamic> json) =>
    _$ProjectDtoImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      email: json['email'] as String,
      projectAdminIds: (json['projectAdminIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      diseaseIds: (json['diseaseIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      surveillanceTypeIds: (json['surveillanceTypeIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      locationIds: (json['locationIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      logisticDetails: (json['logisticDetails'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      processDetail: json['processDetail'] as String?,
      siteIds:
          (json['siteIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
      memberIds: (json['memberIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      visitIds: (json['visitIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      isOnboardingCompleted: json['isOnboardingCompleted'] as bool? ?? false,
      status: json['status'] as String?,
      createdById: json['createdById'] as String?,
      updatedById: json['updatedById'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ProjectDtoImplToJson(_$ProjectDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'code': instance.code,
      'email': instance.email,
      'projectAdminIds': instance.projectAdminIds,
      'diseaseIds': instance.diseaseIds,
      'surveillanceTypeIds': instance.surveillanceTypeIds,
      'locationIds': instance.locationIds,
      'logisticDetails': instance.logisticDetails,
      'processDetail': instance.processDetail,
      'siteIds': instance.siteIds,
      'memberIds': instance.memberIds,
      'visitIds': instance.visitIds,
      'isOnboardingCompleted': instance.isOnboardingCompleted,
      'status': instance.status,
      'createdById': instance.createdById,
      'updatedById': instance.updatedById,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
