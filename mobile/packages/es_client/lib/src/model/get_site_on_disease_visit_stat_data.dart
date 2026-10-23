//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_site_on_disease_visit_stat_data.g.dart';

/// GetSiteOnDiseaseVisitStatData
///
/// Properties:
/// * [totalPresent] 
/// * [totalVisited] 
@BuiltValue()
abstract class GetSiteOnDiseaseVisitStatData implements Built<GetSiteOnDiseaseVisitStatData, GetSiteOnDiseaseVisitStatDataBuilder> {
  @BuiltValueField(wireName: r'totalPresent')
  num get totalPresent;

  @BuiltValueField(wireName: r'totalVisited')
  num get totalVisited;

  GetSiteOnDiseaseVisitStatData._();

  factory GetSiteOnDiseaseVisitStatData([void updates(GetSiteOnDiseaseVisitStatDataBuilder b)]) = _$GetSiteOnDiseaseVisitStatData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetSiteOnDiseaseVisitStatDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetSiteOnDiseaseVisitStatData> get serializer => _$GetSiteOnDiseaseVisitStatDataSerializer();
}

class _$GetSiteOnDiseaseVisitStatDataSerializer implements PrimitiveSerializer<GetSiteOnDiseaseVisitStatData> {
  @override
  final Iterable<Type> types = const [GetSiteOnDiseaseVisitStatData, _$GetSiteOnDiseaseVisitStatData];

  @override
  final String wireName = r'GetSiteOnDiseaseVisitStatData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetSiteOnDiseaseVisitStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalPresent';
    yield serializers.serialize(
      object.totalPresent,
      specifiedType: const FullType(num),
    );
    yield r'totalVisited';
    yield serializers.serialize(
      object.totalVisited,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GetSiteOnDiseaseVisitStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetSiteOnDiseaseVisitStatDataBuilder result,
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
        case r'totalVisited':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalVisited = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GetSiteOnDiseaseVisitStatData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetSiteOnDiseaseVisitStatDataBuilder();
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


