// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'region_response_data.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class RegionResponseDataAdapter extends TypeAdapter<RegionResponseData> {
  @override
  final int typeId = 1;

  @override
  RegionResponseData read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return RegionResponseData(
      id: fields[0] as String?,
      regionType: fields[1] as String?,
      localName: fields[2] as String?,
      name: fields[3] as String?,
      lgdCode: fields[4] as String?,
      createdAt: fields[5] as String?,
      updatedAt: fields[6] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, RegionResponseData obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.regionType)
      ..writeByte(2)
      ..write(obj.localName)
      ..writeByte(3)
      ..write(obj.name)
      ..writeByte(4)
      ..write(obj.lgdCode)
      ..writeByte(5)
      ..write(obj.createdAt)
      ..writeByte(6)
      ..write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RegionResponseDataAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RegionResponseData _$RegionResponseDataFromJson(Map<String, dynamic> json) =>
    RegionResponseData(
      id: json['id'] as String?,
      regionType: json['regionType'] as String?,
      localName: json['localName'] as String?,
      name: json['name'] as String?,
      lgdCode: json['lgdCode'] as String?,
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );

Map<String, dynamic> _$RegionResponseDataToJson(RegionResponseData instance) =>
    <String, dynamic>{
      'id': instance.id,
      'regionType': instance.regionType,
      'localName': instance.localName,
      'name': instance.name,
      'lgdCode': instance.lgdCode,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
