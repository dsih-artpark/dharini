//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/test_result_type.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_lab_test_dto.g.dart';

/// UpdateLabTestDto
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
/// * [ctValue] - Kit or Protocol of Test
/// * [variant] - Variant detected
/// * [viralLoad] - Viral load detected
/// * [testResultReport] - Result Report document of Test
/// * [id] 
/// * [resultDate] - Tested Date of Test
/// * [resultComment] - comments of Test
@BuiltValue()
abstract class UpdateLabTestDto implements Built<UpdateLabTestDto, UpdateLabTestDtoBuilder> {
  /// Sample UUID
  @BuiltValueField(wireName: r'sample')
  JsonObject? get sample;

  /// Disease UUID
  @BuiltValueField(wireName: r'disease')
  JsonObject? get disease;

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

  /// Kit or Protocol of Test
  @BuiltValueField(wireName: r'ctValue')
  String? get ctValue;

  /// Variant detected
  @BuiltValueField(wireName: r'variant')
  String? get variant;

  /// Viral load detected
  @BuiltValueField(wireName: r'viralLoad')
  String? get viralLoad;

  /// Result Report document of Test
  @BuiltValueField(wireName: r'testResultReport')
  String? get testResultReport;

  @BuiltValueField(wireName: r'id')
  String get id;

  /// Tested Date of Test
  @BuiltValueField(wireName: r'resultDate')
  DateTime? get resultDate;

  /// comments of Test
  @BuiltValueField(wireName: r'resultComment')
  String? get resultComment;

  UpdateLabTestDto._();

  factory UpdateLabTestDto([void updates(UpdateLabTestDtoBuilder b)]) = _$UpdateLabTestDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateLabTestDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateLabTestDto> get serializer => _$UpdateLabTestDtoSerializer();
}

class _$UpdateLabTestDtoSerializer implements PrimitiveSerializer<UpdateLabTestDto> {
  @override
  final Iterable<Type> types = const [UpdateLabTestDto, _$UpdateLabTestDto];

  @override
  final String wireName = r'UpdateLabTestDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.sample != null) {
      yield r'sample';
      yield serializers.serialize(
        object.sample,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(JsonObject),
      );
    }
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
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.resultDate != null) {
      yield r'resultDate';
      yield serializers.serialize(
        object.resultDate,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.resultComment != null) {
      yield r'resultComment';
      yield serializers.serialize(
        object.resultComment,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateLabTestDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateLabTestDtoBuilder result,
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
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
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
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'resultDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.resultDate = valueDes;
          break;
        case r'resultComment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.resultComment = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateLabTestDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateLabTestDtoBuilder();
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


