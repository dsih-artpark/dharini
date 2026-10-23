//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_kit_dto.g.dart';

/// UpdateKitDto
///
/// Properties:
/// * [name] - Kit name
/// * [status] - Status
@BuiltValue()
abstract class UpdateKitDto implements Built<UpdateKitDto, UpdateKitDtoBuilder> {
  /// Kit name
  @BuiltValueField(wireName: r'name')
  String? get name;

  /// Status
  @BuiltValueField(wireName: r'status')
  UpdateKitDtoStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  UpdateKitDto._();

  factory UpdateKitDto([void updates(UpdateKitDtoBuilder b)]) = _$UpdateKitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateKitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateKitDto> get serializer => _$UpdateKitDtoSerializer();
}

class _$UpdateKitDtoSerializer implements PrimitiveSerializer<UpdateKitDto> {
  @override
  final Iterable<Type> types = const [UpdateKitDto, _$UpdateKitDto];

  @override
  final String wireName = r'UpdateKitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateKitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.name != null) {
      yield r'name';
      yield serializers.serialize(
        object.name,
        specifiedType: const FullType(String),
      );
    }
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType(UpdateKitDtoStatusEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateKitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateKitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.name = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateKitDtoStatusEnum),
          ) as UpdateKitDtoStatusEnum?;
          if (valueDes == null) continue;
          result.status = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateKitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateKitDtoBuilder();
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


/// Status
class UpdateKitDtoStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const UpdateKitDtoStatusEnum active = _$updateKitDtoStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const UpdateKitDtoStatusEnum inactive = _$updateKitDtoStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const UpdateKitDtoStatusEnum deleted = _$updateKitDtoStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const UpdateKitDtoStatusEnum unknownDefaultOpenApi = _$updateKitDtoStatusEnum_unknownDefaultOpenApi;

  static Serializer<UpdateKitDtoStatusEnum> get serializer => _$updateKitDtoStatusEnumSerializer;

  const UpdateKitDtoStatusEnum._(String name): super(name);

  static BuiltSet<UpdateKitDtoStatusEnum> get values => _$updateKitDtoStatusEnumValues;
  static UpdateKitDtoStatusEnum valueOf(String name) => _$updateKitDtoStatusEnumValueOf(name);
}

