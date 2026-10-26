//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease.dart';
import 'package:es_client/src/model/user.dart';
import 'package:es_client/src/model/project.dart';
import 'package:es_client/src/model/test_result_type.dart';
import 'package:es_client/src/model/sample.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'lab_test_response_data.g.dart';

/// LabTestResponseData
///
/// Properties:
/// * [testResult] 
/// * [project] 
/// * [sample] 
/// * [disease] 
/// * [testedBy] 
/// * [id] 
/// * [ctValue] 
/// * [variant] 
/// * [viralLoad] 
/// * [kitOrProtocol] 
/// * [labComment] 
/// * [resultDate] 
/// * [resultComment] 
/// * [testResultReport] 
/// * [testedAt] 
@BuiltValue()
abstract class LabTestResponseData implements Built<LabTestResponseData, LabTestResponseDataBuilder> {
  @BuiltValueField(wireName: r'testResult')
  TestResultType? get testResult;
  // enum testResultEnum {  pending,  positive,  negative,  unclear,  };

  @BuiltValueField(wireName: r'project')
  Project? get project;

  @BuiltValueField(wireName: r'sample')
  Sample? get sample;

  @BuiltValueField(wireName: r'disease')
  Disease? get disease;

  @BuiltValueField(wireName: r'testedBy')
  User? get testedBy;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'ctValue')
  String? get ctValue;

  @BuiltValueField(wireName: r'variant')
  String? get variant;

  @BuiltValueField(wireName: r'viralLoad')
  String? get viralLoad;

  @BuiltValueField(wireName: r'kitOrProtocol')
  String? get kitOrProtocol;

  @BuiltValueField(wireName: r'labComment')
  String? get labComment;

  @BuiltValueField(wireName: r'resultDate')
  DateTime? get resultDate;

  @BuiltValueField(wireName: r'resultComment')
  String? get resultComment;

  @BuiltValueField(wireName: r'testResultReport')
  String? get testResultReport;

  @BuiltValueField(wireName: r'testedAt')
  DateTime? get testedAt;

  LabTestResponseData._();

  factory LabTestResponseData([void updates(LabTestResponseDataBuilder b)]) = _$LabTestResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(LabTestResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<LabTestResponseData> get serializer => _$LabTestResponseDataSerializer();
}

class _$LabTestResponseDataSerializer implements PrimitiveSerializer<LabTestResponseData> {
  @override
  final Iterable<Type> types = const [LabTestResponseData, _$LabTestResponseData];

  @override
  final String wireName = r'LabTestResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    LabTestResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.testResult != null) {
      yield r'testResult';
      yield serializers.serialize(
        object.testResult,
        specifiedType: const FullType.nullable(TestResultType),
      );
    }
    if (object.project != null) {
      yield r'project';
      yield serializers.serialize(
        object.project,
        specifiedType: const FullType(Project),
      );
    }
    if (object.sample != null) {
      yield r'sample';
      yield serializers.serialize(
        object.sample,
        specifiedType: const FullType(Sample),
      );
    }
    if (object.disease != null) {
      yield r'disease';
      yield serializers.serialize(
        object.disease,
        specifiedType: const FullType(Disease),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(User),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.ctValue != null) {
      yield r'ctValue';
      yield serializers.serialize(
        object.ctValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.variant != null) {
      yield r'variant';
      yield serializers.serialize(
        object.variant,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.viralLoad != null) {
      yield r'viralLoad';
      yield serializers.serialize(
        object.viralLoad,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.kitOrProtocol != null) {
      yield r'kitOrProtocol';
      yield serializers.serialize(
        object.kitOrProtocol,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.labComment != null) {
      yield r'labComment';
      yield serializers.serialize(
        object.labComment,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.resultDate != null) {
      yield r'resultDate';
      yield serializers.serialize(
        object.resultDate,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.resultComment != null) {
      yield r'resultComment';
      yield serializers.serialize(
        object.resultComment,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.testResultReport != null) {
      yield r'testResultReport';
      yield serializers.serialize(
        object.testResultReport,
        specifiedType: const FullType.nullable(String),
      );
    }
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
    LabTestResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required LabTestResponseDataBuilder result,
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
        case r'project':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Project),
          ) as Project?;
          if (valueDes == null) continue;
          result.project.replace(valueDes);
          break;
        case r'sample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Sample),
          ) as Sample?;
          if (valueDes == null) continue;
          result.sample.replace(valueDes);
          break;
        case r'disease':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Disease),
          ) as Disease?;
          if (valueDes == null) continue;
          result.disease.replace(valueDes);
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.testedBy.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
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
        case r'kitOrProtocol':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.kitOrProtocol = valueDes;
          break;
        case r'labComment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.labComment = valueDes;
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
        case r'testResultReport':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.testResultReport = valueDes;
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
  LabTestResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = LabTestResponseDataBuilder();
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


