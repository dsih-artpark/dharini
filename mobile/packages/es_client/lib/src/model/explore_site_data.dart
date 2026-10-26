//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease_site_stat.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/disease_free_site.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'explore_site_data.g.dart';

/// ExploreSiteData
///
/// Properties:
/// * [siteData] 
/// * [diseaseFreeSiteCount] 
/// * [diseaseFreeSitesCoordinates] 
@BuiltValue()
abstract class ExploreSiteData implements Built<ExploreSiteData, ExploreSiteDataBuilder> {
  @BuiltValueField(wireName: r'siteData')
  BuiltList<DiseaseSiteStat> get siteData;

  @BuiltValueField(wireName: r'diseaseFreeSiteCount')
  num get diseaseFreeSiteCount;

  @BuiltValueField(wireName: r'diseaseFreeSitesCoordinates')
  BuiltList<DiseaseFreeSite> get diseaseFreeSitesCoordinates;

  ExploreSiteData._();

  factory ExploreSiteData([void updates(ExploreSiteDataBuilder b)]) = _$ExploreSiteData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ExploreSiteDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ExploreSiteData> get serializer => _$ExploreSiteDataSerializer();
}

class _$ExploreSiteDataSerializer implements PrimitiveSerializer<ExploreSiteData> {
  @override
  final Iterable<Type> types = const [ExploreSiteData, _$ExploreSiteData];

  @override
  final String wireName = r'ExploreSiteData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ExploreSiteData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'siteData';
    yield serializers.serialize(
      object.siteData,
      specifiedType: const FullType(BuiltList, [FullType(DiseaseSiteStat)]),
    );
    yield r'diseaseFreeSiteCount';
    yield serializers.serialize(
      object.diseaseFreeSiteCount,
      specifiedType: const FullType(num),
    );
    yield r'diseaseFreeSitesCoordinates';
    yield serializers.serialize(
      object.diseaseFreeSitesCoordinates,
      specifiedType: const FullType(BuiltList, [FullType(DiseaseFreeSite)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ExploreSiteData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ExploreSiteDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'siteData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(DiseaseSiteStat)]),
          ) as BuiltList<DiseaseSiteStat>;
          result.siteData.replace(valueDes);
          break;
        case r'diseaseFreeSiteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.diseaseFreeSiteCount = valueDes;
          break;
        case r'diseaseFreeSitesCoordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(DiseaseFreeSite)]),
          ) as BuiltList<DiseaseFreeSite>;
          result.diseaseFreeSitesCoordinates.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ExploreSiteData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ExploreSiteDataBuilder();
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


