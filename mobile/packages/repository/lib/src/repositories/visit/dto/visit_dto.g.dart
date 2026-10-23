// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$VisitDtoImpl _$$VisitDtoImplFromJson(Map<String, dynamic> json) =>
    _$VisitDtoImpl(
      id: json['id'] as String?,
      projectId: json['projectId'] as String?,
      siteId: json['siteId'] as String?,
      questionSetId: json['questionSetId'] as String?,
      sampleIds: (json['sampleIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      visitDateTime: json['visitDateTime'] == null
          ? null
          : DateTime.parse(json['visitDateTime'] as String),
      visitScheduleDateTime: json['visitScheduleDateTime'] == null
          ? null
          : DateTime.parse(json['visitScheduleDateTime'] as String),
      visitStatus: json['visitStatus'] as String? ?? 'upcoming',
      collectorIds: (json['collectorIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      status: json['status'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$VisitDtoImplToJson(_$VisitDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'projectId': instance.projectId,
      'siteId': instance.siteId,
      'questionSetId': instance.questionSetId,
      'sampleIds': instance.sampleIds,
      'visitDateTime': instance.visitDateTime?.toIso8601String(),
      'visitScheduleDateTime':
          instance.visitScheduleDateTime?.toIso8601String(),
      'visitStatus': instance.visitStatus,
      'collectorIds': instance.collectorIds,
      'status': instance.status,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
