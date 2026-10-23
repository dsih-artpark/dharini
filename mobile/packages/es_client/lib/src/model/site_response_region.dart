//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/site_response_parent_region.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'site_response_region.g.dart';

/// SiteResponseRegion
///
/// Properties:
/// * [parentRegion] 
/// * [id] 
/// * [regionType] 
/// * [lgdCode] 
/// * [localName] 
/// * [name] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class SiteResponseRegion implements Built<SiteResponseRegion, SiteResponseRegionBuilder> {
  @BuiltValueField(wireName: r'parentRegion')
  SiteResponseParentRegion? get parentRegion;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'regionType')
  SiteResponseRegionRegionTypeEnum get regionType;
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

  SiteResponseRegion._();

  factory SiteResponseRegion([void updates(SiteResponseRegionBuilder b)]) = _$SiteResponseRegion;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SiteResponseRegionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SiteResponseRegion> get serializer => _$SiteResponseRegionSerializer();
}

class _$SiteResponseRegionSerializer implements PrimitiveSerializer<SiteResponseRegion> {
  @override
  final Iterable<Type> types = const [SiteResponseRegion, _$SiteResponseRegion];

  @override
  final String wireName = r'SiteResponseRegion';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SiteResponseRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.parentRegion != null) {
      yield r'parentRegion';
      yield serializers.serialize(
        object.parentRegion,
        specifiedType: const FullType(SiteResponseParentRegion),
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
      specifiedType: const FullType(SiteResponseRegionRegionTypeEnum),
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
    SiteResponseRegion object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SiteResponseRegionBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'parentRegion':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SiteResponseParentRegion),
          ) as SiteResponseParentRegion?;
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
            specifiedType: const FullType(SiteResponseRegionRegionTypeEnum),
          ) as SiteResponseRegionRegionTypeEnum;
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
  SiteResponseRegion deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SiteResponseRegionBuilder();
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


class SiteResponseRegionRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const SiteResponseRegionRegionTypeEnum country = _$siteResponseRegionRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const SiteResponseRegionRegionTypeEnum state = _$siteResponseRegionRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const SiteResponseRegionRegionTypeEnum district = _$siteResponseRegionRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const SiteResponseRegionRegionTypeEnum subdistrict = _$siteResponseRegionRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const SiteResponseRegionRegionTypeEnum city = _$siteResponseRegionRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SiteResponseRegionRegionTypeEnum unknownDefaultOpenApi = _$siteResponseRegionRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<SiteResponseRegionRegionTypeEnum> get serializer => _$siteResponseRegionRegionTypeEnumSerializer;

  const SiteResponseRegionRegionTypeEnum._(String name): super(name);

  static BuiltSet<SiteResponseRegionRegionTypeEnum> get values => _$siteResponseRegionRegionTypeEnumValues;
  static SiteResponseRegionRegionTypeEnum valueOf(String name) => _$siteResponseRegionRegionTypeEnumValueOf(name);
}

