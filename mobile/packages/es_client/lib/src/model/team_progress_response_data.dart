//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/team_progress_response_data_collection_collector.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_progress_response_data.g.dart';

/// TeamProgressResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [pendingVisitCount] 
/// * [completedVisitCount] 
/// * [totalTeamMemberCount] 
/// * [photos] 
/// * [farmType] 
/// * [siteSubType] 
/// * [siteType] 
/// * [status] 
/// * [collectionCollector] 
@BuiltValue()
abstract class TeamProgressResponseData implements Built<TeamProgressResponseData, TeamProgressResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'pendingVisitCount')
  num get pendingVisitCount;

  @BuiltValueField(wireName: r'completedVisitCount')
  num get completedVisitCount;

  @BuiltValueField(wireName: r'totalTeamMemberCount')
  num get totalTeamMemberCount;

  @BuiltValueField(wireName: r'photos')
  BuiltList<String>? get photos;

  @BuiltValueField(wireName: r'farmType')
  String? get farmType;

  @BuiltValueField(wireName: r'siteSubType')
  String? get siteSubType;

  @BuiltValueField(wireName: r'siteType')
  String? get siteType;

  @BuiltValueField(wireName: r'status')
  String? get status;

  @BuiltValueField(wireName: r'collectionCollector')
  TeamProgressResponseDataCollectionCollector? get collectionCollector;

  TeamProgressResponseData._();

  factory TeamProgressResponseData([void updates(TeamProgressResponseDataBuilder b)]) = _$TeamProgressResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamProgressResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamProgressResponseData> get serializer => _$TeamProgressResponseDataSerializer();
}

class _$TeamProgressResponseDataSerializer implements PrimitiveSerializer<TeamProgressResponseData> {
  @override
  final Iterable<Type> types = const [TeamProgressResponseData, _$TeamProgressResponseData];

  @override
  final String wireName = r'TeamProgressResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'pendingVisitCount';
    yield serializers.serialize(
      object.pendingVisitCount,
      specifiedType: const FullType(num),
    );
    yield r'completedVisitCount';
    yield serializers.serialize(
      object.completedVisitCount,
      specifiedType: const FullType(num),
    );
    yield r'totalTeamMemberCount';
    yield serializers.serialize(
      object.totalTeamMemberCount,
      specifiedType: const FullType(num),
    );
    if (object.photos != null) {
      yield r'photos';
      yield serializers.serialize(
        object.photos,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.farmType != null) {
      yield r'farmType';
      yield serializers.serialize(
        object.farmType,
        specifiedType: const FullType(String),
      );
    }
    if (object.siteSubType != null) {
      yield r'siteSubType';
      yield serializers.serialize(
        object.siteSubType,
        specifiedType: const FullType(String),
      );
    }
    if (object.siteType != null) {
      yield r'siteType';
      yield serializers.serialize(
        object.siteType,
        specifiedType: const FullType(String),
      );
    }
    if (object.status != null) {
      yield r'status';
      yield serializers.serialize(
        object.status,
        specifiedType: const FullType(String),
      );
    }
    if (object.collectionCollector != null) {
      yield r'collectionCollector';
      yield serializers.serialize(
        object.collectionCollector,
        specifiedType: const FullType(TeamProgressResponseDataCollectionCollector),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamProgressResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'pendingVisitCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.pendingVisitCount = valueDes;
          break;
        case r'completedVisitCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.completedVisitCount = valueDes;
          break;
        case r'totalTeamMemberCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalTeamMemberCount = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.photos.replace(valueDes);
          break;
        case r'farmType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.farmType = valueDes;
          break;
        case r'siteSubType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteSubType = valueDes;
          break;
        case r'siteType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteType = valueDes;
          break;
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.status = valueDes;
          break;
        case r'collectionCollector':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(TeamProgressResponseDataCollectionCollector),
          ) as TeamProgressResponseDataCollectionCollector?;
          if (valueDes == null) continue;
          result.collectionCollector.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamProgressResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamProgressResponseDataBuilder();
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


