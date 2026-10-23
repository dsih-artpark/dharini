//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_response_dto.g.dart';

/// DiseaseResponseDto
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [shortName] 
/// * [index] 
@BuiltValue()
abstract class DiseaseResponseDto implements Built<DiseaseResponseDto, DiseaseResponseDtoBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'shortName')
  String get shortName;

  @BuiltValueField(wireName: r'index')
  num get index;

  DiseaseResponseDto._();

  factory DiseaseResponseDto([void updates(DiseaseResponseDtoBuilder b)]) = _$DiseaseResponseDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseResponseDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseResponseDto> get serializer => _$DiseaseResponseDtoSerializer();
}

class _$DiseaseResponseDtoSerializer implements PrimitiveSerializer<DiseaseResponseDto> {
  @override
  final Iterable<Type> types = const [DiseaseResponseDto, _$DiseaseResponseDto];

  @override
  final String wireName = r'DiseaseResponseDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseResponseDto object, {
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
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseResponseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseResponseDtoBuilder result,
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseResponseDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseResponseDtoBuilder();
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


