// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SiteDtoImpl _$$SiteDtoImplFromJson(Map<String, dynamic> json) =>
    _$SiteDtoImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      projectId: json['projectId'] as String?,
      diseaseId: json['diseaseId'] as String?,
      collectionFrequencyInterval:
          (json['collectionFrequencyInterval'] as num?)?.toInt(),
      collectionFrequency: (json['collectionFrequency'] as num?)?.toInt(),
      collectionDayOfWeek: (json['collectionDayOfWeek'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      collectionTime: json['collectionTime'] as String?,
      collectionStartDate: json['collectionStartDate'] == null
          ? null
          : DateTime.parse(json['collectionStartDate'] as String),
      collectionLastScheduleDate: json['collectionLastScheduleDate'] == null
          ? null
          : DateTime.parse(json['collectionLastScheduleDate'] as String),
      collectionDuration: (json['collectionDuration'] as num?)?.toInt(),
      collectionCollectorIds: (json['collectionCollectorIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      collectionExpiryDate: json['collectionExpiryDate'] == null
          ? null
          : DateTime.parse(json['collectionExpiryDate'] as String),
      photos:
          (json['photos'] as List<dynamic>?)?.map((e) => e as String).toList(),
      visitIds: (json['visitIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      sampleIds: (json['sampleIds'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      farmType: json['farmType'] as String?,
      siteType: json['siteType'] as String?,
      siteOwnerName: json['siteOwnerName'] as String?,
      siteOwnerNumber: json['siteOwnerNumber'] as String?,
      workerNumber: (json['workerNumber'] as num?)?.toInt(),
      address: json['address'] as String?,
      district: json['district'] as String?,
      state: json['state'] as String?,
      pinCode: (json['pinCode'] as num?)?.toInt(),
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      comment: json['comment'] as String?,
      status: json['status'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$SiteDtoImplToJson(_$SiteDtoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'projectId': instance.projectId,
      'diseaseId': instance.diseaseId,
      'collectionFrequencyInterval': instance.collectionFrequencyInterval,
      'collectionFrequency': instance.collectionFrequency,
      'collectionDayOfWeek': instance.collectionDayOfWeek,
      'collectionTime': instance.collectionTime,
      'collectionStartDate': instance.collectionStartDate?.toIso8601String(),
      'collectionLastScheduleDate':
          instance.collectionLastScheduleDate?.toIso8601String(),
      'collectionDuration': instance.collectionDuration,
      'collectionCollectorIds': instance.collectionCollectorIds,
      'collectionExpiryDate': instance.collectionExpiryDate?.toIso8601String(),
      'photos': instance.photos,
      'visitIds': instance.visitIds,
      'sampleIds': instance.sampleIds,
      'farmType': instance.farmType,
      'siteType': instance.siteType,
      'siteOwnerName': instance.siteOwnerName,
      'siteOwnerNumber': instance.siteOwnerNumber,
      'workerNumber': instance.workerNumber,
      'address': instance.address,
      'district': instance.district,
      'state': instance.state,
      'pinCode': instance.pinCode,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'comment': instance.comment,
      'status': instance.status,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
