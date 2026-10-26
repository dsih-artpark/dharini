import 'package:hive/hive.dart';
import 'package:json_annotation/json_annotation.dart';

part 'region_response_data.g.dart';

@HiveType(typeId: 1)
@JsonSerializable()
class RegionResponseData extends HiveObject {
  @HiveField(0)
  final String? id;

  @HiveField(1)
  final String? regionType;

  @HiveField(2)
  final String? localName;

  @HiveField(3)
  final String? name;

  @HiveField(4)
  final String? lgdCode;

  @HiveField(5)
  final String? createdAt;

  @HiveField(6)
  final String? updatedAt;

  RegionResponseData({
    this.id,
    this.regionType,
    this.localName,
    this.name,
    this.lgdCode,
    this.createdAt,
    this.updatedAt,
  });

  factory RegionResponseData.fromJson(Map<String, dynamic> json) =>
      _$RegionResponseDataFromJson(json);

  Map<String, dynamic> toJson() => _$RegionResponseDataToJson(this);
}
