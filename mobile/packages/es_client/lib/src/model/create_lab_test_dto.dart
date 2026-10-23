//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/test_result_type.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_lab_test_dto.g.dart';

/// CreateLabTestDto
///
/// Properties:
/// * [sample] - Sample UUID
/// * [disease] - Disease UUID
/// * [kitOrProtocol] - Kit or Protocol of Test
/// * [testedAt] - Tested Date of Test
/// * [labComment] - comments of Test
/// * [testedBy] - User who tested the sample
/// * [details] - Additional dynamic details (e.g. ct values, storage)
/// * [testResult] - Test Result
/// * [ctValue] - Ct value detected
/// * [variant] - Variant detected
/// * [viralLoad] - Viral load detected
/// * [testResultReport] - Test Result Report file path/key
@BuiltValue()
abstract class CreateLabTestDto implements Built<CreateLabTestDto, CreateLabTestDtoBuilder> {
  /// Sample UUID
  @BuiltValueField(wireName: r'sample')
  JsonObject? get sample;

  /// Disease UUID
  @BuiltValueField(wireName: r'disease')
  JsonObject get disease;

  /// Kit or Protocol of Test
  @BuiltValueField(wireName: r'kitOrProtocol')
  String? get kitOrProtocol;

  /// Tested Date of Test
  @BuiltValueField(wireName: r'testedAt')
  DateTime? get testedAt;

  /// comments of Test
  @BuiltValueField(wireName: r'labComment')
  String? get labComment;

  /// User who tested the sample
  @BuiltValueField(wireName: r'testedBy')
  JsonObject? get testedBy;

  /// Additional dynamic details (e.g. ct values, storage)
  @BuiltValueField(wireName: r'details')
  JsonObject? get details;

  /// Test Result
  @BuiltValueField(wireName: r'testResult')
  TestResultType? get testResult;
  // enum testResultEnum {  pending,  positive,  negative,  unclear,  };

  /// Ct value detected
  @BuiltValueField(wireName: r'ctValue')
  String? get ctValue;

  /// Variant detected
  @BuiltValueField(wireName: r'variant')
  String? get variant;

  /// Viral load detected
  @BuiltValueField(wireName: r'viralLoad')
  String? get viralLoad;

  /// Test Result Report file path/key
  @BuiltValueField(wireName: r'testResultReport')
  String? get testResultReport;

  CreateLabTestDto._();

  factory CreateLabTestDto([void updates(CreateLabTestDtoBuilder b)]) = _$CreateLabTestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateLabTestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateLabTestDto> get serializer => _$CreateLabTestDtoSerializer();
}

class _$CreateLabTestDtoSerializer implements PrimitiveSerializer<CreateLabTestDto> {
  @override
  final Iterable<Type> types = const [CreateLabTestDto, _$CreateLabTestDto];

  @override
  final String wireName = r'CreateLabTestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.sample != null) {
      yield r'sample';
      yield serializers.serialize(
        object.sample,
        specifiedType: const FullType(JsonObject),
      );
    }
    yield r'disease';
    yield serializers.serialize(
      object.disease,
      specifiedType: const FullType(JsonObject),
    );
    if (object.kitOrProtocol != null) {
      yield r'kitOrProtocol';
      yield serializers.serialize(
        object.kitOrProtocol,
        specifiedType: const FullType(String),
      );
    }
    if (object.testedAt != null) {
      yield r'testedAt';
      yield serializers.serialize(
        object.testedAt,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.labComment != null) {
      yield r'labComment';
      yield serializers.serialize(
        object.labComment,
        specifiedType: const FullType(String),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.details != null) {
      yield r'details';
      yield serializers.serialize(
        object.details,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.testResult != null) {
      yield r'testResult';
      yield serializers.serialize(
        object.testResult,
        specifiedType: const FullType(TestResultType),
      );
    }
    if (object.ctValue != null) {
      yield r'ctValue';
      yield serializers.serialize(
        object.ctValue,
        specifiedType: const FullType(String),
      );
    }
    if (object.variant != null) {
      yield r'variant';
      yield serializers.serialize(
        object.variant,
        specifiedType: const FullType(String),
      );
    }
    if (object.viralLoad != null) {
      yield r'viralLoad';
      yield serializers.serialize(
        object.viralLoad,
        specifiedType: const FullType(String),
      );
    }
    if (object.testResultReport != null) {
      yield r'testResultReport';
      yield serializers.serialize(
        object.testResultReport,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateLabTestDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'sample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.sample = valueDes;
          break;
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.disease = valueDes;
          break;
        case r'kitOrProtocol':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.kitOrProtocol = valueDes;
          break;
        case r'testedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.testedAt = valueDes;
          break;
        case r'labComment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.labComment = valueDes;
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.testedBy = valueDes;
          break;
        case r'details':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.details = valueDes;
          break;
        case r'testResult':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(TestResultType),
          ) as TestResultType?;
          if (valueDes == null) continue;
          result.testResult = valueDes;
          break;
        case r'ctValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.ctValue = valueDes;
          break;
        case r'variant':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.variant = valueDes;
          break;
        case r'viralLoad':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.viralLoad = valueDes;
          break;
        case r'testResultReport':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.testResultReport = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateLabTestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateLabTestDtoBuilder();
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


