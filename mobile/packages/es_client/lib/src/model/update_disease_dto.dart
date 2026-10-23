//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_disease_dto.g.dart';

/// UpdateDiseaseDto
///
/// Properties:
/// * [name] - Name of the disease
/// * [shortName] - Short name of the disease
/// * [code] - Code associated with the disease
@BuiltValue()
abstract class UpdateDiseaseDto implements Built<UpdateDiseaseDto, UpdateDiseaseDtoBuilder> {
  /// Name of the disease
  @BuiltValueField(wireName: r'name')
  String? get name;

  /// Short name of the disease
  @BuiltValueField(wireName: r'shortName')
  String? get shortName;

  /// Code associated with the disease
  @BuiltValueField(wireName: r'code')
  String? get code;

  UpdateDiseaseDto._();

  factory UpdateDiseaseDto([void updates(UpdateDiseaseDtoBuilder b)]) = _$UpdateDiseaseDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateDiseaseDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateDiseaseDto> get serializer => _$UpdateDiseaseDtoSerializer();
}

class _$UpdateDiseaseDtoSerializer implements PrimitiveSerializer<UpdateDiseaseDto> {
  @override
  final Iterable<Type> types = const [UpdateDiseaseDto, _$UpdateDiseaseDto];

  @override
  final String wireName = r'UpdateDiseaseDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateDiseaseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.name != null) {
      yield r'name';
      yield serializers.serialize(
        object.name,
        specifiedType: const FullType(String),
      );
    }
    if (object.shortName != null) {
      yield r'shortName';
      yield serializers.serialize(
        object.shortName,
        specifiedType: const FullType(String),
      );
    }
    if (object.code != null) {
      yield r'code';
      yield serializers.serialize(
        object.code,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateDiseaseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateDiseaseDtoBuilder result,
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
        case r'shortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.shortName = valueDes;
          break;
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
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
  UpdateDiseaseDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateDiseaseDtoBuilder();
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


