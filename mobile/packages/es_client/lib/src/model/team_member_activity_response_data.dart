//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_member_activity_response_data.g.dart';

/// TeamMemberActivityResponseData
///
/// Properties:
/// * [id] 
/// * [firstName] 
/// * [lastName] 
/// * [totalCollected] 
/// * [totalReceived] 
/// * [totalExtracted] 
/// * [totalTested] 
/// * [totalReportGenerated] 
@BuiltValue()
abstract class TeamMemberActivityResponseData implements Built<TeamMemberActivityResponseData, TeamMemberActivityResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  @BuiltValueField(wireName: r'lastName')
  String get lastName;

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

  TeamMemberActivityResponseData._();

  factory TeamMemberActivityResponseData([void updates(TeamMemberActivityResponseDataBuilder b)]) = _$TeamMemberActivityResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamMemberActivityResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamMemberActivityResponseData> get serializer => _$TeamMemberActivityResponseDataSerializer();
}

class _$TeamMemberActivityResponseDataSerializer implements PrimitiveSerializer<TeamMemberActivityResponseData> {
  @override
  final Iterable<Type> types = const [TeamMemberActivityResponseData, _$TeamMemberActivityResponseData];

  @override
  final String wireName = r'TeamMemberActivityResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamMemberActivityResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
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
    TeamMemberActivityResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamMemberActivityResponseDataBuilder result,
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
  TeamMemberActivityResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamMemberActivityResponseDataBuilder();
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


