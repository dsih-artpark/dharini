//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/site_stat_type.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'most_positive_site_response_data.g.dart';

/// MostPositiveSiteResponseData
///
/// Properties:
/// * [siteStats] 
@BuiltValue()
abstract class MostPositiveSiteResponseData implements Built<MostPositiveSiteResponseData, MostPositiveSiteResponseDataBuilder> {
  @BuiltValueField(wireName: r'siteStats')
  BuiltList<SiteStatType> get siteStats;

  MostPositiveSiteResponseData._();

  factory MostPositiveSiteResponseData([void updates(MostPositiveSiteResponseDataBuilder b)]) = _$MostPositiveSiteResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MostPositiveSiteResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MostPositiveSiteResponseData> get serializer => _$MostPositiveSiteResponseDataSerializer();
}

class _$MostPositiveSiteResponseDataSerializer implements PrimitiveSerializer<MostPositiveSiteResponseData> {
  @override
  final Iterable<Type> types = const [MostPositiveSiteResponseData, _$MostPositiveSiteResponseData];

  @override
  final String wireName = r'MostPositiveSiteResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MostPositiveSiteResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'siteStats';
    yield serializers.serialize(
      object.siteStats,
      specifiedType: const FullType(BuiltList, [FullType(SiteStatType)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MostPositiveSiteResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MostPositiveSiteResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'siteStats':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(SiteStatType)]),
          ) as BuiltList<SiteStatType>;
          result.siteStats.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MostPositiveSiteResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MostPositiveSiteResponseDataBuilder();
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


