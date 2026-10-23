//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_region_dto.g.dart';

/// CreateRegionDto
///
/// Properties:
/// * [regionType] 
/// * [name] 
/// * [parentId] 
@BuiltValue()
abstract class CreateRegionDto implements Built<CreateRegionDto, CreateRegionDtoBuilder> {
  @BuiltValueField(wireName: r'regionType')
  CreateRegionDtoRegionTypeEnum get regionType;
  // enum regionTypeEnum {  country,  state,  district,  subdistrict,  city,  };

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'parentId')
  String? get parentId;

  CreateRegionDto._();

  factory CreateRegionDto([void updates(CreateRegionDtoBuilder b)]) = _$CreateRegionDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateRegionDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateRegionDto> get serializer => _$CreateRegionDtoSerializer();
}

class _$CreateRegionDtoSerializer implements PrimitiveSerializer<CreateRegionDto> {
  @override
  final Iterable<Type> types = const [CreateRegionDto, _$CreateRegionDto];

  @override
  final String wireName = r'CreateRegionDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateRegionDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(CreateRegionDtoRegionTypeEnum),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    if (object.parentId != null) {
      yield r'parentId';
      yield serializers.serialize(
        object.parentId,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateRegionDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateRegionDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'regionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateRegionDtoRegionTypeEnum),
          ) as CreateRegionDtoRegionTypeEnum;
          result.regionType = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'parentId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.parentId = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateRegionDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateRegionDtoBuilder();
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


class CreateRegionDtoRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const CreateRegionDtoRegionTypeEnum country = _$createRegionDtoRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const CreateRegionDtoRegionTypeEnum state = _$createRegionDtoRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const CreateRegionDtoRegionTypeEnum district = _$createRegionDtoRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const CreateRegionDtoRegionTypeEnum subdistrict = _$createRegionDtoRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const CreateRegionDtoRegionTypeEnum city = _$createRegionDtoRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateRegionDtoRegionTypeEnum unknownDefaultOpenApi = _$createRegionDtoRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<CreateRegionDtoRegionTypeEnum> get serializer => _$createRegionDtoRegionTypeEnumSerializer;

  const CreateRegionDtoRegionTypeEnum._(String name): super(name);

  static BuiltSet<CreateRegionDtoRegionTypeEnum> get values => _$createRegionDtoRegionTypeEnumValues;
  static CreateRegionDtoRegionTypeEnum valueOf(String name) => _$createRegionDtoRegionTypeEnumValueOf(name);
}

