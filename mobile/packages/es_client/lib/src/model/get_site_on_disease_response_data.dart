//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/get_site_on_disease_visit_stat_data.dart';
import 'package:es_client/src/model/get_site_on_disease_site_stat_data.dart';
import 'package:es_client/src/model/get_site_on_sample_visit_stat_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_site_on_disease_response_data.g.dart';

/// GetSiteOnDiseaseResponseData
///
/// Properties:
/// * [sites] 
/// * [visits] 
/// * [samples] 
@BuiltValue()
abstract class GetSiteOnDiseaseResponseData implements Built<GetSiteOnDiseaseResponseData, GetSiteOnDiseaseResponseDataBuilder> {
  @BuiltValueField(wireName: r'sites')
  GetSiteOnDiseaseSiteStatData get sites;

  @BuiltValueField(wireName: r'visits')
  GetSiteOnDiseaseVisitStatData get visits;

  @BuiltValueField(wireName: r'samples')
  GetSiteOnSampleVisitStatData get samples;

  GetSiteOnDiseaseResponseData._();

  factory GetSiteOnDiseaseResponseData([void updates(GetSiteOnDiseaseResponseDataBuilder b)]) = _$GetSiteOnDiseaseResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetSiteOnDiseaseResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetSiteOnDiseaseResponseData> get serializer => _$GetSiteOnDiseaseResponseDataSerializer();
}

class _$GetSiteOnDiseaseResponseDataSerializer implements PrimitiveSerializer<GetSiteOnDiseaseResponseData> {
  @override
  final Iterable<Type> types = const [GetSiteOnDiseaseResponseData, _$GetSiteOnDiseaseResponseData];

  @override
  final String wireName = r'GetSiteOnDiseaseResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetSiteOnDiseaseResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'sites';
    yield serializers.serialize(
      object.sites,
      specifiedType: const FullType(GetSiteOnDiseaseSiteStatData),
    );
    yield r'visits';
    yield serializers.serialize(
      object.visits,
      specifiedType: const FullType(GetSiteOnDiseaseVisitStatData),
    );
    yield r'samples';
    yield serializers.serialize(
      object.samples,
      specifiedType: const FullType(GetSiteOnSampleVisitStatData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GetSiteOnDiseaseResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetSiteOnDiseaseResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'sites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(GetSiteOnDiseaseSiteStatData),
          ) as GetSiteOnDiseaseSiteStatData;
          result.sites.replace(valueDes);
          break;
        case r'visits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(GetSiteOnDiseaseVisitStatData),
          ) as GetSiteOnDiseaseVisitStatData;
          result.visits.replace(valueDes);
          break;
        case r'samples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(GetSiteOnSampleVisitStatData),
          ) as GetSiteOnSampleVisitStatData;
          result.samples.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GetSiteOnDiseaseResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetSiteOnDiseaseResponseDataBuilder();
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


