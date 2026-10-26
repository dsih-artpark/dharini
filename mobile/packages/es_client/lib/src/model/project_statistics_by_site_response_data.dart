//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'project_statistics_by_site_response_data.g.dart';

/// ProjectStatisticsBySiteResponseData
///
/// Properties:
/// * [total] 
/// * [pending] 
/// * [positive] 
/// * [negative] 
@BuiltValue()
abstract class ProjectStatisticsBySiteResponseData implements Built<ProjectStatisticsBySiteResponseData, ProjectStatisticsBySiteResponseDataBuilder> {
  @BuiltValueField(wireName: r'total')
  num get total;

  @BuiltValueField(wireName: r'pending')
  num get pending;

  @BuiltValueField(wireName: r'positive')
  num get positive;

  @BuiltValueField(wireName: r'negative')
  num get negative;

  ProjectStatisticsBySiteResponseData._();

  factory ProjectStatisticsBySiteResponseData([void updates(ProjectStatisticsBySiteResponseDataBuilder b)]) = _$ProjectStatisticsBySiteResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProjectStatisticsBySiteResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProjectStatisticsBySiteResponseData> get serializer => _$ProjectStatisticsBySiteResponseDataSerializer();
}

class _$ProjectStatisticsBySiteResponseDataSerializer implements PrimitiveSerializer<ProjectStatisticsBySiteResponseData> {
  @override
  final Iterable<Type> types = const [ProjectStatisticsBySiteResponseData, _$ProjectStatisticsBySiteResponseData];

  @override
  final String wireName = r'ProjectStatisticsBySiteResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProjectStatisticsBySiteResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'total';
    yield serializers.serialize(
      object.total,
      specifiedType: const FullType(num),
    );
    yield r'pending';
    yield serializers.serialize(
      object.pending,
      specifiedType: const FullType(num),
    );
    yield r'positive';
    yield serializers.serialize(
      object.positive,
      specifiedType: const FullType(num),
    );
    yield r'negative';
    yield serializers.serialize(
      object.negative,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProjectStatisticsBySiteResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProjectStatisticsBySiteResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'total':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.total = valueDes;
          break;
        case r'pending':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.pending = valueDes;
          break;
        case r'positive':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positive = valueDes;
          break;
        case r'negative':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.negative = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProjectStatisticsBySiteResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProjectStatisticsBySiteResponseDataBuilder();
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


