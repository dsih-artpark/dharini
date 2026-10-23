//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_kit_dto.g.dart';

/// CreateKitDto
///
/// Properties:
/// * [name] - Kit name
/// * [status] - Status
@BuiltValue()
abstract class CreateKitDto implements Built<CreateKitDto, CreateKitDtoBuilder> {
  /// Kit name
  @BuiltValueField(wireName: r'name')
  String get name;

  /// Status
  @BuiltValueField(wireName: r'status')
  CreateKitDtoStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  CreateKitDto._();

  factory CreateKitDto([void updates(CreateKitDtoBuilder b)]) = _$CreateKitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateKitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateKitDto> get serializer => _$CreateKitDtoSerializer();
}

class _$CreateKitDtoSerializer implements PrimitiveSerializer<CreateKitDto> {
  @override
  final Iterable<Type> types = const [CreateKitDto, _$CreateKitDto];

  @override
  final String wireName = r'CreateKitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateKitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType(CreateKitDtoStatusEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateKitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateKitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateKitDtoStatusEnum),
          ) as CreateKitDtoStatusEnum?;
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
  CreateKitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateKitDtoBuilder();
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
class CreateKitDtoStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const CreateKitDtoStatusEnum active = _$createKitDtoStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const CreateKitDtoStatusEnum inactive = _$createKitDtoStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const CreateKitDtoStatusEnum deleted = _$createKitDtoStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateKitDtoStatusEnum unknownDefaultOpenApi = _$createKitDtoStatusEnum_unknownDefaultOpenApi;

  static Serializer<CreateKitDtoStatusEnum> get serializer => _$createKitDtoStatusEnumSerializer;

  const CreateKitDtoStatusEnum._(String name): super(name);

  static BuiltSet<CreateKitDtoStatusEnum> get values => _$createKitDtoStatusEnumValues;
  static CreateKitDtoStatusEnum valueOf(String name) => _$createKitDtoStatusEnumValueOf(name);
}

