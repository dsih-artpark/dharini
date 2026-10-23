//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_region_dto.g.dart';

/// UpdateRegionDto
///
/// Properties:
/// * [status] - Status of the region
/// * [regionType] 
/// * [name] 
@BuiltValue()
abstract class UpdateRegionDto implements Built<UpdateRegionDto, UpdateRegionDtoBuilder> {
  /// Status of the region
  @BuiltValueField(wireName: r'status')
  UpdateRegionDtoStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'regionType')
  UpdateRegionDtoRegionTypeEnum get regionType;
  // enum regionTypeEnum {  country,  state,  district,  subdistrict,  city,  };

  @BuiltValueField(wireName: r'name')
  String get name;

  UpdateRegionDto._();

  factory UpdateRegionDto([void updates(UpdateRegionDtoBuilder b)]) = _$UpdateRegionDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateRegionDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateRegionDto> get serializer => _$UpdateRegionDtoSerializer();
}

class _$UpdateRegionDtoSerializer implements PrimitiveSerializer<UpdateRegionDto> {
  @override
  final Iterable<Type> types = const [UpdateRegionDto, _$UpdateRegionDto];

  @override
  final String wireName = r'UpdateRegionDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateRegionDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType(UpdateRegionDtoStatusEnum),
      );
    }
    yield r'regionType';
    yield serializers.serialize(
      object.regionType,
      specifiedType: const FullType(UpdateRegionDtoRegionTypeEnum),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateRegionDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateRegionDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateRegionDtoStatusEnum),
          ) as UpdateRegionDtoStatusEnum?;
          if (valueDes == null) continue;
          result.status = valueDes;
          break;
        case r'regionType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UpdateRegionDtoRegionTypeEnum),
          ) as UpdateRegionDtoRegionTypeEnum;
          result.regionType = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateRegionDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateRegionDtoBuilder();
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


/// Status of the region
class UpdateRegionDtoStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UpdateRegionDtoStatusEnum active = _$updateRegionDtoStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const UpdateRegionDtoStatusEnum inactive = _$updateRegionDtoStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const UpdateRegionDtoStatusEnum deleted = _$updateRegionDtoStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UpdateRegionDtoStatusEnum unknownDefaultOpenApi = _$updateRegionDtoStatusEnum_unknownDefaultOpenApi;

  static Serializer<UpdateRegionDtoStatusEnum> get serializer => _$updateRegionDtoStatusEnumSerializer;

  const UpdateRegionDtoStatusEnum._(String name): super(name);

  static BuiltSet<UpdateRegionDtoStatusEnum> get values => _$updateRegionDtoStatusEnumValues;
  static UpdateRegionDtoStatusEnum valueOf(String name) => _$updateRegionDtoStatusEnumValueOf(name);
}

class UpdateRegionDtoRegionTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'country')
  static const UpdateRegionDtoRegionTypeEnum country = _$updateRegionDtoRegionTypeEnum_country;
  @BuiltValueEnumConst(wireName: r'state')
  static const UpdateRegionDtoRegionTypeEnum state = _$updateRegionDtoRegionTypeEnum_state;
  @BuiltValueEnumConst(wireName: r'district')
  static const UpdateRegionDtoRegionTypeEnum district = _$updateRegionDtoRegionTypeEnum_district;
  @BuiltValueEnumConst(wireName: r'subdistrict')
  static const UpdateRegionDtoRegionTypeEnum subdistrict = _$updateRegionDtoRegionTypeEnum_subdistrict;
  @BuiltValueEnumConst(wireName: r'city')
  static const UpdateRegionDtoRegionTypeEnum city = _$updateRegionDtoRegionTypeEnum_city;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UpdateRegionDtoRegionTypeEnum unknownDefaultOpenApi = _$updateRegionDtoRegionTypeEnum_unknownDefaultOpenApi;

  static Serializer<UpdateRegionDtoRegionTypeEnum> get serializer => _$updateRegionDtoRegionTypeEnumSerializer;

  const UpdateRegionDtoRegionTypeEnum._(String name): super(name);

  static BuiltSet<UpdateRegionDtoRegionTypeEnum> get values => _$updateRegionDtoRegionTypeEnumValues;
  static UpdateRegionDtoRegionTypeEnum valueOf(String name) => _$updateRegionDtoRegionTypeEnumValueOf(name);
}

