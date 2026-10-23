//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/surveillance_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_type.g.dart';

/// SampleType
///
/// Properties:
/// * [emojiIcon] - Dynamic emoji for the sample type
/// * [diseaseShortNames] - List of applicable disease short names
/// * [surveillanceType] 
/// * [id] 
/// * [name] 
/// * [status] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class SampleType implements Built<SampleType, SampleTypeBuilder> {
  /// Dynamic emoji for the sample type
  @BuiltValueField(wireName: r'emojiIcon')
  String? get emojiIcon;

  /// List of applicable disease short names
  @BuiltValueField(wireName: r'diseaseShortNames')
  BuiltList<String>? get diseaseShortNames;

  @BuiltValueField(wireName: r'surveillanceType')
  SurveillanceType? get surveillanceType;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'status')
  SampleTypeStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  SampleType._();

  factory SampleType([void updates(SampleTypeBuilder b)]) = _$SampleType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleType> get serializer => _$SampleTypeSerializer();
}

class _$SampleTypeSerializer implements PrimitiveSerializer<SampleType> {
  @override
  final Iterable<Type> types = const [SampleType, _$SampleType];

  @override
  final String wireName = r'SampleType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleType object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.emojiIcon != null) {
      yield r'emojiIcon';
      yield serializers.serialize(
        object.emojiIcon,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.diseaseShortNames != null) {
      yield r'diseaseShortNames';
      yield serializers.serialize(
        object.diseaseShortNames,
        specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
      );
    }
    if (object.surveillanceType != null) {
      yield r'surveillanceType';
      yield serializers.serialize(
        object.surveillanceType,
        specifiedType: const FullType(SurveillanceType),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(SampleTypeStatusEnum),
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
    SampleType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleTypeBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'emojiIcon':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.emojiIcon = valueDes;
          break;
        case r'diseaseShortNames':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseaseShortNames.replace(valueDes);
          break;
        case r'surveillanceType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SurveillanceType),
          ) as SurveillanceType?;
          if (valueDes == null) continue;
          result.surveillanceType.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
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
            specifiedType: const FullType(SampleTypeStatusEnum),
          ) as SampleTypeStatusEnum;
          result.status = valueDes;
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
  SampleType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleTypeBuilder();
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


class SampleTypeStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const SampleTypeStatusEnum active = _$sampleTypeStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const SampleTypeStatusEnum inactive = _$sampleTypeStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const SampleTypeStatusEnum deleted = _$sampleTypeStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SampleTypeStatusEnum unknownDefaultOpenApi = _$sampleTypeStatusEnum_unknownDefaultOpenApi;

  static Serializer<SampleTypeStatusEnum> get serializer => _$sampleTypeStatusEnumSerializer;

  const SampleTypeStatusEnum._(String name): super(name);

  static BuiltSet<SampleTypeStatusEnum> get values => _$sampleTypeStatusEnumValues;
  static SampleTypeStatusEnum valueOf(String name) => _$sampleTypeStatusEnumValueOf(name);
}

