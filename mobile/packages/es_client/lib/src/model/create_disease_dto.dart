//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_disease_dto.g.dart';

/// CreateDiseaseDto
///
/// Properties:
/// * [name] - Name of the disease
/// * [shortName] - Short name of the disease
/// * [code] - Code associated with the disease
@BuiltValue()
abstract class CreateDiseaseDto implements Built<CreateDiseaseDto, CreateDiseaseDtoBuilder> {
  /// Name of the disease
  @BuiltValueField(wireName: r'name')
  String get name;

  /// Short name of the disease
  @BuiltValueField(wireName: r'shortName')
  String get shortName;

  /// Code associated with the disease
  @BuiltValueField(wireName: r'code')
  String get code;

  CreateDiseaseDto._();

  factory CreateDiseaseDto([void updates(CreateDiseaseDtoBuilder b)]) = _$CreateDiseaseDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateDiseaseDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateDiseaseDto> get serializer => _$CreateDiseaseDtoSerializer();
}

class _$CreateDiseaseDtoSerializer implements PrimitiveSerializer<CreateDiseaseDto> {
  @override
  final Iterable<Type> types = const [CreateDiseaseDto, _$CreateDiseaseDto];

  @override
  final String wireName = r'CreateDiseaseDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateDiseaseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateDiseaseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateDiseaseDtoBuilder result,
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
        case r'shortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.shortName = valueDes;
          break;
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateDiseaseDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateDiseaseDtoBuilder();
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


