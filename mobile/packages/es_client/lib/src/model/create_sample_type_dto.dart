//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_sample_type_dto.g.dart';

/// CreateSampleTypeDto
///
/// Properties:
/// * [name] - Name
/// * [surveillanceType] - surveillanceType
/// * [emojiIcon] - Dynamic emoji for the sample type
/// * [abbreviation] - Abbreviation for the sample type
/// * [diseaseShortNames] - List of applicable disease short names
/// * [status] - Status
@BuiltValue()
abstract class CreateSampleTypeDto implements Built<CreateSampleTypeDto, CreateSampleTypeDtoBuilder> {
  /// Name
  @BuiltValueField(wireName: r'name')
  String get name;

  /// surveillanceType
  @BuiltValueField(wireName: r'surveillanceType')
  JsonObject get surveillanceType;

  /// Dynamic emoji for the sample type
  @BuiltValueField(wireName: r'emojiIcon')
  String? get emojiIcon;

  /// Abbreviation for the sample type
  @BuiltValueField(wireName: r'abbreviation')
  String? get abbreviation;

  /// List of applicable disease short names
  @BuiltValueField(wireName: r'diseaseShortNames')
  BuiltList<String>? get diseaseShortNames;

  /// Status
  @BuiltValueField(wireName: r'status')
  CreateSampleTypeDtoStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  CreateSampleTypeDto._();

  factory CreateSampleTypeDto([void updates(CreateSampleTypeDtoBuilder b)]) = _$CreateSampleTypeDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSampleTypeDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSampleTypeDto> get serializer => _$CreateSampleTypeDtoSerializer();
}

class _$CreateSampleTypeDtoSerializer implements PrimitiveSerializer<CreateSampleTypeDto> {
  @override
  final Iterable<Type> types = const [CreateSampleTypeDto, _$CreateSampleTypeDto];

  @override
  final String wireName = r'CreateSampleTypeDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSampleTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'surveillanceType';
    yield serializers.serialize(
      object.surveillanceType,
      specifiedType: const FullType(JsonObject),
    );
    if (object.emojiIcon != null) {
      yield r'emojiIcon';
      yield serializers.serialize(
        object.emojiIcon,
        specifiedType: const FullType(String),
      );
    }
    if (object.abbreviation != null) {
      yield r'abbreviation';
      yield serializers.serialize(
        object.abbreviation,
        specifiedType: const FullType(String),
      );
    }
    if (object.diseaseShortNames != null) {
      yield r'diseaseShortNames';
      yield serializers.serialize(
        object.diseaseShortNames,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType(CreateSampleTypeDtoStatusEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSampleTypeDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSampleTypeDtoBuilder result,
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
        case r'surveillanceType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.surveillanceType = valueDes;
          break;
        case r'emojiIcon':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.emojiIcon = valueDes;
          break;
        case r'abbreviation':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.abbreviation = valueDes;
          break;
        case r'diseaseShortNames':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseaseShortNames.replace(valueDes);
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateSampleTypeDtoStatusEnum),
          ) as CreateSampleTypeDtoStatusEnum?;
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
  CreateSampleTypeDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSampleTypeDtoBuilder();
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
class CreateSampleTypeDtoStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const CreateSampleTypeDtoStatusEnum active = _$createSampleTypeDtoStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const CreateSampleTypeDtoStatusEnum inactive = _$createSampleTypeDtoStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const CreateSampleTypeDtoStatusEnum deleted = _$createSampleTypeDtoStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateSampleTypeDtoStatusEnum unknownDefaultOpenApi = _$createSampleTypeDtoStatusEnum_unknownDefaultOpenApi;

  static Serializer<CreateSampleTypeDtoStatusEnum> get serializer => _$createSampleTypeDtoStatusEnumSerializer;

  const CreateSampleTypeDtoStatusEnum._(String name): super(name);

  static BuiltSet<CreateSampleTypeDtoStatusEnum> get values => _$createSampleTypeDtoStatusEnumValues;
  static CreateSampleTypeDtoStatusEnum valueOf(String name) => _$createSampleTypeDtoStatusEnumValueOf(name);
}

