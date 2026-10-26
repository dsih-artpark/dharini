//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/user_response_dto.dart';
import 'package:es_client/src/model/disease_response_dto.dart';
import 'package:es_client/src/model/sample_exposes_dto.dart';
import 'package:es_client/src/model/test_result_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lab_test_response_dto.g.dart';

/// LabTestResponseDto
///
/// Properties:
/// * [testResult] 
/// * [sample] 
/// * [testedBy] 
/// * [disease] 
/// * [id] 
/// * [testedAt] 
@BuiltValue()
abstract class LabTestResponseDto implements Built<LabTestResponseDto, LabTestResponseDtoBuilder> {
  @BuiltValueField(wireName: r'testResult')
  TestResultType? get testResult;
  // enum testResultEnum {  pending,  positive,  negative,  unclear,  };

  @BuiltValueField(wireName: r'sample')
  SampleExposesDto? get sample;

  @BuiltValueField(wireName: r'testedBy')
  UserResponseDto? get testedBy;

  @BuiltValueField(wireName: r'disease')
  DiseaseResponseDto? get disease;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'testedAt')
  DateTime? get testedAt;

  LabTestResponseDto._();

  factory LabTestResponseDto([void updates(LabTestResponseDtoBuilder b)]) = _$LabTestResponseDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LabTestResponseDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LabTestResponseDto> get serializer => _$LabTestResponseDtoSerializer();
}

class _$LabTestResponseDtoSerializer implements PrimitiveSerializer<LabTestResponseDto> {
  @override
  final Iterable<Type> types = const [LabTestResponseDto, _$LabTestResponseDto];

  @override
  final String wireName = r'LabTestResponseDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LabTestResponseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.testResult != null) {
      yield r'testResult';
      yield serializers.serialize(
        object.testResult,
        specifiedType: const FullType.nullable(TestResultType),
      );
    }
    if (object.sample != null) {
      yield r'sample';
      yield serializers.serialize(
        object.sample,
        specifiedType: const FullType(SampleExposesDto),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(UserResponseDto),
      );
    }
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(DiseaseResponseDto),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.testedAt != null) {
      yield r'testedAt';
      yield serializers.serialize(
        object.testedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    LabTestResponseDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LabTestResponseDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'testResult':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(TestResultType),
          ) as TestResultType?;
          if (valueDes == null) continue;
          result.testResult = valueDes;
          break;
        case r'sample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SampleExposesDto),
          ) as SampleExposesDto?;
          if (valueDes == null) continue;
          result.sample.replace(valueDes);
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UserResponseDto),
          ) as UserResponseDto?;
          if (valueDes == null) continue;
          result.testedBy.replace(valueDes);
          break;
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DiseaseResponseDto),
          ) as DiseaseResponseDto?;
          if (valueDes == null) continue;
          result.disease.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'testedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.testedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  LabTestResponseDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LabTestResponseDtoBuilder();
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


