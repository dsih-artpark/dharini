//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_site_stat.g.dart';

/// DiseaseSiteStat
///
/// Properties:
/// * [diseaseId] 
/// * [diseaseName] 
/// * [diseaseIndex] 
/// * [shortName] 
/// * [totalSites] 
/// * [positiveSites] 
/// * [negativeSites] 
/// * [positiveSitesCoordinates] 
/// * [negativeSitesCoordinates] 
@BuiltValue()
abstract class DiseaseSiteStat implements Built<DiseaseSiteStat, DiseaseSiteStatBuilder> {
  @BuiltValueField(wireName: r'diseaseId')
  String get diseaseId;

  @BuiltValueField(wireName: r'diseaseName')
  String get diseaseName;

  @BuiltValueField(wireName: r'diseaseIndex')
  num? get diseaseIndex;

  @BuiltValueField(wireName: r'shortName')
  String get shortName;

  @BuiltValueField(wireName: r'totalSites')
  num get totalSites;

  @BuiltValueField(wireName: r'positiveSites')
  num get positiveSites;

  @BuiltValueField(wireName: r'negativeSites')
  num get negativeSites;

  @BuiltValueField(wireName: r'positiveSitesCoordinates')
  BuiltList<JsonObject> get positiveSitesCoordinates;

  @BuiltValueField(wireName: r'negativeSitesCoordinates')
  BuiltList<JsonObject> get negativeSitesCoordinates;

  DiseaseSiteStat._();

  factory DiseaseSiteStat([void updates(DiseaseSiteStatBuilder b)]) = _$DiseaseSiteStat;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseSiteStatBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseSiteStat> get serializer => _$DiseaseSiteStatSerializer();
}

class _$DiseaseSiteStatSerializer implements PrimitiveSerializer<DiseaseSiteStat> {
  @override
  final Iterable<Type> types = const [DiseaseSiteStat, _$DiseaseSiteStat];

  @override
  final String wireName = r'DiseaseSiteStat';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseSiteStat object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'diseaseId';
    yield serializers.serialize(
      object.diseaseId,
      specifiedType: const FullType(String),
    );
    yield r'diseaseName';
    yield serializers.serialize(
      object.diseaseName,
      specifiedType: const FullType(String),
    );
    if (object.diseaseIndex != null) {
      yield r'diseaseIndex';
      yield serializers.serialize(
        object.diseaseIndex,
        specifiedType: const FullType(num),
      );
    }
    yield r'shortName';
    yield serializers.serialize(
      object.shortName,
      specifiedType: const FullType(String),
    );
    yield r'totalSites';
    yield serializers.serialize(
      object.totalSites,
      specifiedType: const FullType(num),
    );
    yield r'positiveSites';
    yield serializers.serialize(
      object.positiveSites,
      specifiedType: const FullType(num),
    );
    yield r'negativeSites';
    yield serializers.serialize(
      object.negativeSites,
      specifiedType: const FullType(num),
    );
    yield r'positiveSitesCoordinates';
    yield serializers.serialize(
      object.positiveSitesCoordinates,
      specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
    );
    yield r'negativeSitesCoordinates';
    yield serializers.serialize(
      object.negativeSitesCoordinates,
      specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DiseaseSiteStat object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseSiteStatBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'diseaseId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseId = valueDes;
          break;
        case r'diseaseName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.diseaseName = valueDes;
          break;
        case r'diseaseIndex':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.diseaseIndex = valueDes;
          break;
        case r'shortName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.shortName = valueDes;
          break;
        case r'totalSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSites = valueDes;
          break;
        case r'positiveSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positiveSites = valueDes;
          break;
        case r'negativeSites':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.negativeSites = valueDes;
          break;
        case r'positiveSitesCoordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>;
          result.positiveSitesCoordinates.replace(valueDes);
          break;
        case r'negativeSitesCoordinates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>;
          result.negativeSitesCoordinates.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DiseaseSiteStat deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseSiteStatBuilder();
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


