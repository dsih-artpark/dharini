//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/region.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'region_response_data.g.dart';

/// RegionResponseData
///
/// Properties:
/// * [subRegions] 
/// * [parentRegion] 
/// * [id] 
/// * [regionType] 
/// * [lgdCode] 
/// * [localName] 
/// * [name] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class RegionResponseData implements Built<RegionResponseData, RegionResponseDataBuilder> {
  @BuiltValueField(wireName: r'subRegions')
  BuiltList<Region>? get subRegions;

  @BuiltValueField(wireName: r'parentRegion')
  Region? get parentRegion;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  RegionResponseDataRegionTypeEnum get regionType;
  // enum regionTypeEnum {  country,  state,  district,  subdistrict,  city,  };

  @BuiltValueField(wireName: r'lgdCode')
  String? get lgdCode;

  @BuiltValueField(wireName: r'localName')
  String get localName;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  RegionResponseData._();

  factory RegionResponseData([void updates(RegionResponseDataBuilder b)]) = _$RegionResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RegionResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RegionResponseData> get serializer => _$RegionResponseDataSerializer();
}

class _$RegionResponseDataSerializer implements PrimitiveSerializer<RegionResponseData> {
  @override
  final Iterable<Type> types = const [RegionResponseData, _$RegionResponseData];

  @override
  final String wireName = r'RegionResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RegionResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.subRegions != null) {
      yield r'subRegions';
      yield serializers.serialize(
        object.subRegions,
        specifiedType: const FullType(BuiltList, [FullType(Region)]),
      );
    }
    if (object.parentRegion != null) {
      yield r'parentRegion';
      yield serializers.serialize(
        object.parentRegion,
        specifiedType: const FullType(Region),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(RegionResponseDataRegionTypeEnum),
    );
    if (object.lgdCode != null) {
      yield r'lgdCode';
      yield serializers.serialize(
        object.lgdCode,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'localName';
    yield serializers.serialize(
      object.localName,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'updatedAt';
    yield serializers.serialize(
      object.updatedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RegionResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RegionResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'subRegions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(Region)]),
          ) as BuiltList<Region>?;
          if (valueDes == null) continue;
          result.subRegions.replace(valueDes);
          break;
        case r'parentRegion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Region),
          ) as Region?;
          if (valueDes == null) continue;
          result.parentRegion.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'regionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(RegionResponseDataRegionTypeEnum),
          ) as RegionResponseDataRegionTypeEnum;
          result.regionType = valueDes;
          break;
        case r'lgdCode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lgdCode = valueDes;
          break;
        case r'localName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.localName = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'updatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RegionResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RegionResponseDataBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}


class RegionResponseDataRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const RegionResponseDataRegionTypeEnum country = _$regionResponseDataRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const RegionResponseDataRegionTypeEnum state = _$regionResponseDataRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const RegionResponseDataRegionTypeEnum district = _$regionResponseDataRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const RegionResponseDataRegionTypeEnum subdistrict = _$regionResponseDataRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const RegionResponseDataRegionTypeEnum city = _$regionResponseDataRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const RegionResponseDataRegionTypeEnum unknownDefaultOpenApi = _$regionResponseDataRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<RegionResponseDataRegionTypeEnum> get serializer => _$regionResponseDataRegionTypeEnumSerializer;

  const RegionResponseDataRegionTypeEnum._(String name): super(name);

  static BuiltSet<RegionResponseDataRegionTypeEnum> get values => _$regionResponseDataRegionTypeEnumValues;
  static RegionResponseDataRegionTypeEnum valueOf(String name) => _$regionResponseDataRegionTypeEnumValueOf(name);
}

