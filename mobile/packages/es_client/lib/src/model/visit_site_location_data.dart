//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/site_response_region.dart';
import 'package:es_client/src/model/location_coordinates.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_site_location_data.g.dart';

/// VisitSiteLocationData
///
/// Properties:
/// * [coordinates] 
/// * [region] 
/// * [id] 
@BuiltValue()
abstract class VisitSiteLocationData implements Built<VisitSiteLocationData, VisitSiteLocationDataBuilder> {
  @BuiltValueField(wireName: r'coordinates')
  LocationCoordinates? get coordinates;

  @BuiltValueField(wireName: r'region')
  SiteResponseRegion? get region;

  @BuiltValueField(wireName: r'id')
  String get id;

  VisitSiteLocationData._();

  factory VisitSiteLocationData([void updates(VisitSiteLocationDataBuilder b)]) = _$VisitSiteLocationData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitSiteLocationDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitSiteLocationData> get serializer => _$VisitSiteLocationDataSerializer();
}

class _$VisitSiteLocationDataSerializer implements PrimitiveSerializer<VisitSiteLocationData> {
  @override
  final Iterable<Type> types = const [VisitSiteLocationData, _$VisitSiteLocationData];

  @override
  final String wireName = r'VisitSiteLocationData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitSiteLocationData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.coordinates != null) {
      yield r'coordinates';
      yield serializers.serialize(
        object.coordinates,
        specifiedType: const FullType(LocationCoordinates),
      );
    }
    if (object.region != null) {
      yield r'region';
      yield serializers.serialize(
        object.region,
        specifiedType: const FullType(SiteResponseRegion),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitSiteLocationData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitSiteLocationDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'coordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(LocationCoordinates),
          ) as LocationCoordinates?;
          if (valueDes == null) continue;
          result.coordinates.replace(valueDes);
          break;
        case r'region':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(SiteResponseRegion),
          ) as SiteResponseRegion?;
          if (valueDes == null) continue;
          result.region.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VisitSiteLocationData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitSiteLocationDataBuilder();
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


