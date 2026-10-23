//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'surveillance_type_response_data.g.dart';

/// SurveillanceTypeResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [status] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class SurveillanceTypeResponseData implements Built<SurveillanceTypeResponseData, SurveillanceTypeResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'status')
  SurveillanceTypeResponseDataStatusEnum get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  SurveillanceTypeResponseData._();

  factory SurveillanceTypeResponseData([void updates(SurveillanceTypeResponseDataBuilder b)]) = _$SurveillanceTypeResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SurveillanceTypeResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SurveillanceTypeResponseData> get serializer => _$SurveillanceTypeResponseDataSerializer();
}

class _$SurveillanceTypeResponseDataSerializer implements PrimitiveSerializer<SurveillanceTypeResponseData> {
  @override
  final Iterable<Type> types = const [SurveillanceTypeResponseData, _$SurveillanceTypeResponseData];

  @override
  final String wireName = r'SurveillanceTypeResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SurveillanceTypeResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
      specifiedType: const FullType(SurveillanceTypeResponseDataStatusEnum),
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
    SurveillanceTypeResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SurveillanceTypeResponseDataBuilder result,
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
            specifiedType: const FullType(SurveillanceTypeResponseDataStatusEnum),
          ) as SurveillanceTypeResponseDataStatusEnum;
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
  SurveillanceTypeResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SurveillanceTypeResponseDataBuilder();
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


class SurveillanceTypeResponseDataStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const SurveillanceTypeResponseDataStatusEnum active = _$surveillanceTypeResponseDataStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const SurveillanceTypeResponseDataStatusEnum inactive = _$surveillanceTypeResponseDataStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const SurveillanceTypeResponseDataStatusEnum deleted = _$surveillanceTypeResponseDataStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const SurveillanceTypeResponseDataStatusEnum unknownDefaultOpenApi = _$surveillanceTypeResponseDataStatusEnum_unknownDefaultOpenApi;

  static Serializer<SurveillanceTypeResponseDataStatusEnum> get serializer => _$surveillanceTypeResponseDataStatusEnumSerializer;

  const SurveillanceTypeResponseDataStatusEnum._(String name): super(name);

  static BuiltSet<SurveillanceTypeResponseDataStatusEnum> get values => _$surveillanceTypeResponseDataStatusEnumValues;
  static SurveillanceTypeResponseDataStatusEnum valueOf(String name) => _$surveillanceTypeResponseDataStatusEnumValueOf(name);
}

