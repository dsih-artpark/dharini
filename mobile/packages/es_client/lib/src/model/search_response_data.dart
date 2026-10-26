//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/disease_search_response_data.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/site_search_response_data.dart';
import 'package:es_client/src/model/project_search_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'search_response_data.g.dart';

/// SearchResponseData
///
/// Properties:
/// * [projects] 
/// * [sites] 
/// * [diseases] 
@BuiltValue()
abstract class SearchResponseData implements Built<SearchResponseData, SearchResponseDataBuilder> {
  @BuiltValueField(wireName: r'projects')
  BuiltList<ProjectSearchResponseData> get projects;

  @BuiltValueField(wireName: r'sites')
  BuiltList<SiteSearchResponseData> get sites;

  @BuiltValueField(wireName: r'diseases')
  BuiltList<DiseaseSearchResponseData> get diseases;

  SearchResponseData._();

  factory SearchResponseData([void updates(SearchResponseDataBuilder b)]) = _$SearchResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SearchResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SearchResponseData> get serializer => _$SearchResponseDataSerializer();
}

class _$SearchResponseDataSerializer implements PrimitiveSerializer<SearchResponseData> {
  @override
  final Iterable<Type> types = const [SearchResponseData, _$SearchResponseData];

  @override
  final String wireName = r'SearchResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'projects';
    yield serializers.serialize(
      object.projects,
      specifiedType: const FullType(BuiltList, [FullType(ProjectSearchResponseData)]),
    );
    yield r'sites';
    yield serializers.serialize(
      object.sites,
      specifiedType: const FullType(BuiltList, [FullType(SiteSearchResponseData)]),
    );
    yield r'diseases';
    yield serializers.serialize(
      object.diseases,
      specifiedType: const FullType(BuiltList, [FullType(DiseaseSearchResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SearchResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'projects':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(ProjectSearchResponseData)]),
          ) as BuiltList<ProjectSearchResponseData>;
          result.projects.replace(valueDes);
          break;
        case r'sites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(SiteSearchResponseData)]),
          ) as BuiltList<SiteSearchResponseData>;
          result.sites.replace(valueDes);
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(DiseaseSearchResponseData)]),
          ) as BuiltList<DiseaseSearchResponseData>;
          result.diseases.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SearchResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SearchResponseDataBuilder();
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


