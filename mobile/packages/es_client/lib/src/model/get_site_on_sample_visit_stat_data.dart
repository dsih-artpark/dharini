//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_site_on_sample_visit_stat_data.g.dart';

/// GetSiteOnSampleVisitStatData
///
/// Properties:
/// * [totalPresent] 
/// * [totalTested] 
@BuiltValue()
abstract class GetSiteOnSampleVisitStatData implements Built<GetSiteOnSampleVisitStatData, GetSiteOnSampleVisitStatDataBuilder> {
  @BuiltValueField(wireName: r'totalPresent')
  num get totalPresent;

  @BuiltValueField(wireName: r'totalTested')
  num get totalTested;

  GetSiteOnSampleVisitStatData._();

  factory GetSiteOnSampleVisitStatData([void updates(GetSiteOnSampleVisitStatDataBuilder b)]) = _$GetSiteOnSampleVisitStatData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetSiteOnSampleVisitStatDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetSiteOnSampleVisitStatData> get serializer => _$GetSiteOnSampleVisitStatDataSerializer();
}

class _$GetSiteOnSampleVisitStatDataSerializer implements PrimitiveSerializer<GetSiteOnSampleVisitStatData> {
  @override
  final Iterable<Type> types = const [GetSiteOnSampleVisitStatData, _$GetSiteOnSampleVisitStatData];

  @override
  final String wireName = r'GetSiteOnSampleVisitStatData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetSiteOnSampleVisitStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalPresent';
    yield serializers.serialize(
      object.totalPresent,
      specifiedType: const FullType(num),
    );
    yield r'totalTested';
    yield serializers.serialize(
      object.totalTested,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GetSiteOnSampleVisitStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetSiteOnSampleVisitStatDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalPresent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPresent = valueDes;
          break;
        case r'totalTested':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalTested = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GetSiteOnSampleVisitStatData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetSiteOnSampleVisitStatDataBuilder();
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


