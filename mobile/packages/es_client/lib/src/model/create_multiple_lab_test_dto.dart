//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/create_lab_test_dto.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_multiple_lab_test_dto.g.dart';

/// CreateMultipleLabTestDto
///
/// Properties:
/// * [labTests] - CreateLabTestDto
@BuiltValue()
abstract class CreateMultipleLabTestDto implements Built<CreateMultipleLabTestDto, CreateMultipleLabTestDtoBuilder> {
  /// CreateLabTestDto
  @BuiltValueField(wireName: r'labTests')
  BuiltList<CreateLabTestDto> get labTests;

  CreateMultipleLabTestDto._();

  factory CreateMultipleLabTestDto([void updates(CreateMultipleLabTestDtoBuilder b)]) = _$CreateMultipleLabTestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateMultipleLabTestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateMultipleLabTestDto> get serializer => _$CreateMultipleLabTestDtoSerializer();
}

class _$CreateMultipleLabTestDtoSerializer implements PrimitiveSerializer<CreateMultipleLabTestDto> {
  @override
  final Iterable<Type> types = const [CreateMultipleLabTestDto, _$CreateMultipleLabTestDto];

  @override
  final String wireName = r'CreateMultipleLabTestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateMultipleLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'labTests';
    yield serializers.serialize(
      object.labTests,
      specifiedType: const FullType(BuiltList, [FullType(CreateLabTestDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateMultipleLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateMultipleLabTestDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'labTests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(CreateLabTestDto)]),
          ) as BuiltList<CreateLabTestDto>;
          result.labTests.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateMultipleLabTestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateMultipleLabTestDtoBuilder();
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


