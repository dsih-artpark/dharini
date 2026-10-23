//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/lab_test_details_dto.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lab_test_dto.g.dart';

/// LabTestDto
///
/// Properties:
/// * [disease] 
/// * [testedAt] 
/// * [testResult] 
/// * [testedBy] 
/// * [extraDetails] 
/// * [details] 
@BuiltValue()
abstract class LabTestDto implements Built<LabTestDto, LabTestDtoBuilder> {
  @BuiltValueField(wireName: r'disease')
  String get disease;

  @BuiltValueField(wireName: r'testedAt')
  String get testedAt;

  @BuiltValueField(wireName: r'testResult')
  String get testResult;

  @BuiltValueField(wireName: r'testedBy')
  JsonObject get testedBy;

  @BuiltValueField(wireName: r'extraDetails')
  LabTestDetailsDto get extraDetails;

  @BuiltValueField(wireName: r'details')
  LabTestDetailsDto get details;

  LabTestDto._();

  factory LabTestDto([void updates(LabTestDtoBuilder b)]) = _$LabTestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LabTestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LabTestDto> get serializer => _$LabTestDtoSerializer();
}

class _$LabTestDtoSerializer implements PrimitiveSerializer<LabTestDto> {
  @override
  final Iterable<Type> types = const [LabTestDto, _$LabTestDto];

  @override
  final String wireName = r'LabTestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'disease';
    yield serializers.serialize(
      object.disease,
      specifiedType: const FullType(String),
    );
    yield r'testedAt';
    yield serializers.serialize(
      object.testedAt,
      specifiedType: const FullType(String),
    );
    yield r'testResult';
    yield serializers.serialize(
      object.testResult,
      specifiedType: const FullType(String),
    );
    yield r'testedBy';
    yield serializers.serialize(
      object.testedBy,
      specifiedType: const FullType(JsonObject),
    );
    yield r'extraDetails';
    yield serializers.serialize(
      object.extraDetails,
      specifiedType: const FullType(LabTestDetailsDto),
    );
    yield r'details';
    yield serializers.serialize(
      object.details,
      specifiedType: const FullType(LabTestDetailsDto),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    LabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LabTestDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.disease = valueDes;
          break;
        case r'testedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.testedAt = valueDes;
          break;
        case r'testResult':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.testResult = valueDes;
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.testedBy = valueDes;
          break;
        case r'extraDetails':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(LabTestDetailsDto),
          ) as LabTestDetailsDto;
          result.extraDetails.replace(valueDes);
          break;
        case r'details':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(LabTestDetailsDto),
          ) as LabTestDetailsDto;
          result.details.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  LabTestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LabTestDtoBuilder();
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


