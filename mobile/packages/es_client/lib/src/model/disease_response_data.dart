//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_response_data.g.dart';

/// DiseaseResponseData
///
/// Properties:
/// * [id] 
/// * [code] 
/// * [name] 
/// * [shortName] 
/// * [index] 
/// * [createdAt] 
/// * [updatedAt] 
/// * [status] 
@BuiltValue()
abstract class DiseaseResponseData implements Built<DiseaseResponseData, DiseaseResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'shortName')
  String get shortName;

  @BuiltValueField(wireName: r'index')
  num get index;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  @BuiltValueField(wireName: r'status')
  DiseaseResponseDataStatusEnum? get status;
  // enum statusEnum {  active,  inactive,  deleted,  };

  DiseaseResponseData._();

  factory DiseaseResponseData([void updates(DiseaseResponseDataBuilder b)]) = _$DiseaseResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseResponseData> get serializer => _$DiseaseResponseDataSerializer();
}

class _$DiseaseResponseDataSerializer implements PrimitiveSerializer<DiseaseResponseData> {
  @override
  final Iterable<Type> types = const [DiseaseResponseData, _$DiseaseResponseData];

  @override
  final String wireName = r'DiseaseResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'shortName';
    yield serializers.serialize(
      object.shortName,
      specifiedType: const FullType(String),
    );
    yield r'index';
    yield serializers.serialize(
      object.index,
      specifiedType: const FullType(num),
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
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType.nullable(DiseaseResponseDataStatusEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseResponseDataBuilder result,
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
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'shortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.shortName = valueDes;
          break;
        case r'index':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.index = valueDes;
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
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DiseaseResponseDataStatusEnum),
          ) as DiseaseResponseDataStatusEnum?;
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
  DiseaseResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseResponseDataBuilder();
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


class DiseaseResponseDataStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'active')
  static const DiseaseResponseDataStatusEnum active = _$diseaseResponseDataStatusEnum_active;
  @BuiltValueEnumConst(wireName: r'inactive')
  static const DiseaseResponseDataStatusEnum inactive = _$diseaseResponseDataStatusEnum_inactive;
  @BuiltValueEnumConst(wireName: r'deleted')
  static const DiseaseResponseDataStatusEnum deleted = _$diseaseResponseDataStatusEnum_deleted;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const DiseaseResponseDataStatusEnum unknownDefaultOpenApi = _$diseaseResponseDataStatusEnum_unknownDefaultOpenApi;

  static Serializer<DiseaseResponseDataStatusEnum> get serializer => _$diseaseResponseDataStatusEnumSerializer;

  const DiseaseResponseDataStatusEnum._(String name): super(name);

  static BuiltSet<DiseaseResponseDataStatusEnum> get values => _$diseaseResponseDataStatusEnumValues;
  static DiseaseResponseDataStatusEnum valueOf(String name) => _$diseaseResponseDataStatusEnumValueOf(name);
}

