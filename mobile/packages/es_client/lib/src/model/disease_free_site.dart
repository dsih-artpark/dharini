//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/location_coordinates.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_free_site.g.dart';

/// DiseaseFreeSite
///
/// Properties:
/// * [coordinates] 
/// * [siteName] 
/// * [totalSampleCount] 
/// * [totalPositiveSampleCount] 
@BuiltValue()
abstract class DiseaseFreeSite implements Built<DiseaseFreeSite, DiseaseFreeSiteBuilder> {
  @BuiltValueField(wireName: r'coordinates')
  LocationCoordinates get coordinates;

  @BuiltValueField(wireName: r'siteName')
  String get siteName;

  @BuiltValueField(wireName: r'totalSampleCount')
  num get totalSampleCount;

  @BuiltValueField(wireName: r'totalPositiveSampleCount')
  num get totalPositiveSampleCount;

  DiseaseFreeSite._();

  factory DiseaseFreeSite([void updates(DiseaseFreeSiteBuilder b)]) = _$DiseaseFreeSite;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseFreeSiteBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseFreeSite> get serializer => _$DiseaseFreeSiteSerializer();
}

class _$DiseaseFreeSiteSerializer implements PrimitiveSerializer<DiseaseFreeSite> {
  @override
  final Iterable<Type> types = const [DiseaseFreeSite, _$DiseaseFreeSite];

  @override
  final String wireName = r'DiseaseFreeSite';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseFreeSite object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'coordinates';
    yield serializers.serialize(
      object.coordinates,
      specifiedType: const FullType(LocationCoordinates),
    );
    yield r'siteName';
    yield serializers.serialize(
      object.siteName,
      specifiedType: const FullType(String),
    );
    yield r'totalSampleCount';
    yield serializers.serialize(
      object.totalSampleCount,
      specifiedType: const FullType(num),
    );
    yield r'totalPositiveSampleCount';
    yield serializers.serialize(
      object.totalPositiveSampleCount,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseFreeSite object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseFreeSiteBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'coordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(LocationCoordinates),
          ) as LocationCoordinates;
          result.coordinates.replace(valueDes);
          break;
        case r'siteName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteName = valueDes;
          break;
        case r'totalSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSampleCount = valueDes;
          break;
        case r'totalPositiveSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPositiveSampleCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseFreeSite deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseFreeSiteBuilder();
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


