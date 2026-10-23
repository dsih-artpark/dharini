//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_member_progress_response_data.g.dart';

/// TeamMemberProgressResponseData
///
/// Properties:
/// * [userId] 
/// * [firstName] 
/// * [lastName] 
/// * [siteId] 
/// * [siteName] 
/// * [pendingVisitCount] 
/// * [completedVisitCount] 
/// * [totalCollected] 
/// * [totalReceived] 
/// * [totalExtracted] 
/// * [totalTested] 
/// * [totalReportGenerated] 
@BuiltValue()
abstract class TeamMemberProgressResponseData implements Built<TeamMemberProgressResponseData, TeamMemberProgressResponseDataBuilder> {
  @BuiltValueField(wireName: r'userId')
  String get userId;

  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  @BuiltValueField(wireName: r'lastName')
  String get lastName;

  @BuiltValueField(wireName: r'siteId')
  String get siteId;

  @BuiltValueField(wireName: r'siteName')
  String get siteName;

  @BuiltValueField(wireName: r'pendingVisitCount')
  num get pendingVisitCount;

  @BuiltValueField(wireName: r'completedVisitCount')
  num get completedVisitCount;

  @BuiltValueField(wireName: r'totalCollected')
  num get totalCollected;

  @BuiltValueField(wireName: r'totalReceived')
  num get totalReceived;

  @BuiltValueField(wireName: r'totalExtracted')
  num get totalExtracted;

  @BuiltValueField(wireName: r'totalTested')
  num get totalTested;

  @BuiltValueField(wireName: r'totalReportGenerated')
  num get totalReportGenerated;

  TeamMemberProgressResponseData._();

  factory TeamMemberProgressResponseData([void updates(TeamMemberProgressResponseDataBuilder b)]) = _$TeamMemberProgressResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamMemberProgressResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamMemberProgressResponseData> get serializer => _$TeamMemberProgressResponseDataSerializer();
}

class _$TeamMemberProgressResponseDataSerializer implements PrimitiveSerializer<TeamMemberProgressResponseData> {
  @override
  final Iterable<Type> types = const [TeamMemberProgressResponseData, _$TeamMemberProgressResponseData];

  @override
  final String wireName = r'TeamMemberProgressResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamMemberProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(String),
    );
    yield r'firstName';
    yield serializers.serialize(
      object.firstName,
      specifiedType: const FullType(String),
    );
    yield r'lastName';
    yield serializers.serialize(
      object.lastName,
      specifiedType: const FullType(String),
    );
    yield r'siteId';
    yield serializers.serialize(
      object.siteId,
      specifiedType: const FullType(String),
    );
    yield r'siteName';
    yield serializers.serialize(
      object.siteName,
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
    yield r'totalCollected';
    yield serializers.serialize(
      object.totalCollected,
      specifiedType: const FullType(num),
    );
    yield r'totalReceived';
    yield serializers.serialize(
      object.totalReceived,
      specifiedType: const FullType(num),
    );
    yield r'totalExtracted';
    yield serializers.serialize(
      object.totalExtracted,
      specifiedType: const FullType(num),
    );
    yield r'totalTested';
    yield serializers.serialize(
      object.totalTested,
      specifiedType: const FullType(num),
    );
    yield r'totalReportGenerated';
    yield serializers.serialize(
      object.totalReportGenerated,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamMemberProgressResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamMemberProgressResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userId = valueDes;
          break;
        case r'firstName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.firstName = valueDes;
          break;
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.lastName = valueDes;
          break;
        case r'siteId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteId = valueDes;
          break;
        case r'siteName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteName = valueDes;
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
        case r'totalCollected':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalCollected = valueDes;
          break;
        case r'totalReceived':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalReceived = valueDes;
          break;
        case r'totalExtracted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalExtracted = valueDes;
          break;
        case r'totalTested':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalTested = valueDes;
          break;
        case r'totalReportGenerated':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalReportGenerated = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamMemberProgressResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamMemberProgressResponseDataBuilder();
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


