//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_statistic_by_diseases_response_data.g.dart';

/// ProjectStatisticByDiseasesResponseData
///
/// Properties:
/// * [diseasesName] 
/// * [diseaseSName] 
/// * [siteCount] 
@BuiltValue()
abstract class ProjectStatisticByDiseasesResponseData implements Built<ProjectStatisticByDiseasesResponseData, ProjectStatisticByDiseasesResponseDataBuilder> {
  @BuiltValueField(wireName: r'diseasesName')
  String get diseasesName;

  @BuiltValueField(wireName: r'diseaseSName')
  String get diseaseSName;

  @BuiltValueField(wireName: r'siteCount')
  num get siteCount;

  ProjectStatisticByDiseasesResponseData._();

  factory ProjectStatisticByDiseasesResponseData([void updates(ProjectStatisticByDiseasesResponseDataBuilder b)]) = _$ProjectStatisticByDiseasesResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectStatisticByDiseasesResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectStatisticByDiseasesResponseData> get serializer => _$ProjectStatisticByDiseasesResponseDataSerializer();
}

class _$ProjectStatisticByDiseasesResponseDataSerializer implements PrimitiveSerializer<ProjectStatisticByDiseasesResponseData> {
  @override
  final Iterable<Type> types = const [ProjectStatisticByDiseasesResponseData, _$ProjectStatisticByDiseasesResponseData];

  @override
  final String wireName = r'ProjectStatisticByDiseasesResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectStatisticByDiseasesResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseasesName';
    yield serializers.serialize(
      object.diseasesName,
      specifiedType: const FullType(String),
    );
    yield r'diseaseSName';
    yield serializers.serialize(
      object.diseaseSName,
      specifiedType: const FullType(String),
    );
    yield r'siteCount';
    yield serializers.serialize(
      object.siteCount,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectStatisticByDiseasesResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectStatisticByDiseasesResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseasesName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseasesName = valueDes;
          break;
        case r'diseaseSName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseSName = valueDes;
          break;
        case r'siteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.siteCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectStatisticByDiseasesResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectStatisticByDiseasesResponseDataBuilder();
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


