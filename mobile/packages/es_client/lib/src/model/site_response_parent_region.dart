//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'site_response_parent_region.g.dart';

/// SiteResponseParentRegion
///
/// Properties:
/// * [id] 
/// * [regionType] 
/// * [lgdCode] 
/// * [localName] 
/// * [name] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class SiteResponseParentRegion implements Built<SiteResponseParentRegion, SiteResponseParentRegionBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  SiteResponseParentRegionRegionTypeEnum get regionType;
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

  SiteResponseParentRegion._();

  factory SiteResponseParentRegion([void updates(SiteResponseParentRegionBuilder b)]) = _$SiteResponseParentRegion;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SiteResponseParentRegionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SiteResponseParentRegion> get serializer => _$SiteResponseParentRegionSerializer();
}

class _$SiteResponseParentRegionSerializer implements PrimitiveSerializer<SiteResponseParentRegion> {
  @override
  final Iterable<Type> types = const [SiteResponseParentRegion, _$SiteResponseParentRegion];

  @override
  final String wireName = r'SiteResponseParentRegion';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SiteResponseParentRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(SiteResponseParentRegionRegionTypeEnum),
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
    SiteResponseParentRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SiteResponseParentRegionBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
            specifiedType: const FullType(SiteResponseParentRegionRegionTypeEnum),
          ) as SiteResponseParentRegionRegionTypeEnum;
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
  SiteResponseParentRegion deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SiteResponseParentRegionBuilder();
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


class SiteResponseParentRegionRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const SiteResponseParentRegionRegionTypeEnum country = _$siteResponseParentRegionRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const SiteResponseParentRegionRegionTypeEnum state = _$siteResponseParentRegionRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const SiteResponseParentRegionRegionTypeEnum district = _$siteResponseParentRegionRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const SiteResponseParentRegionRegionTypeEnum subdistrict = _$siteResponseParentRegionRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const SiteResponseParentRegionRegionTypeEnum city = _$siteResponseParentRegionRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SiteResponseParentRegionRegionTypeEnum unknownDefaultOpenApi = _$siteResponseParentRegionRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<SiteResponseParentRegionRegionTypeEnum> get serializer => _$siteResponseParentRegionRegionTypeEnumSerializer;

  const SiteResponseParentRegionRegionTypeEnum._(String name): super(name);

  static BuiltSet<SiteResponseParentRegionRegionTypeEnum> get values => _$siteResponseParentRegionRegionTypeEnumValues;
  static SiteResponseParentRegionRegionTypeEnum valueOf(String name) => _$siteResponseParentRegionRegionTypeEnumValueOf(name);
}

