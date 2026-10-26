//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/update_lab_test_dto.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_multiple_lab_test_dto.g.dart';

/// UpdateMultipleLabTestDto
///
/// Properties:
/// * [labTests] - updateLabTestDto
@BuiltValue()
abstract class UpdateMultipleLabTestDto implements Built<UpdateMultipleLabTestDto, UpdateMultipleLabTestDtoBuilder> {
  /// updateLabTestDto
  @BuiltValueField(wireName: r'labTests')
  BuiltList<UpdateLabTestDto> get labTests;

  UpdateMultipleLabTestDto._();

  factory UpdateMultipleLabTestDto([void updates(UpdateMultipleLabTestDtoBuilder b)]) = _$UpdateMultipleLabTestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateMultipleLabTestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateMultipleLabTestDto> get serializer => _$UpdateMultipleLabTestDtoSerializer();
}

class _$UpdateMultipleLabTestDtoSerializer implements PrimitiveSerializer<UpdateMultipleLabTestDto> {
  @override
  final Iterable<Type> types = const [UpdateMultipleLabTestDto, _$UpdateMultipleLabTestDto];

  @override
  final String wireName = r'UpdateMultipleLabTestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateMultipleLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'labTests';
    yield serializers.serialize(
      object.labTests,
      specifiedType: const FullType(BuiltList, [FullType(UpdateLabTestDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateMultipleLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateMultipleLabTestDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'labTests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(UpdateLabTestDto)]),
          ) as BuiltList<UpdateLabTestDto>;
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
  UpdateMultipleLabTestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateMultipleLabTestDtoBuilder();
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


