//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_members_collector_list_type.g.dart';

/// TeamMembersCollectorListType
///
/// Properties:
/// * [id] 
/// * [firstName] 
/// * [lastName] 
/// * [siteCount] 
/// * [lastVisitedVisit] 
@BuiltValue()
abstract class TeamMembersCollectorListType implements Built<TeamMembersCollectorListType, TeamMembersCollectorListTypeBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  @BuiltValueField(wireName: r'lastName')
  String get lastName;

  @BuiltValueField(wireName: r'siteCount')
  num get siteCount;

  @BuiltValueField(wireName: r'lastVisitedVisit')
  DateTime? get lastVisitedVisit;

  TeamMembersCollectorListType._();

  factory TeamMembersCollectorListType([void updates(TeamMembersCollectorListTypeBuilder b)]) = _$TeamMembersCollectorListType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamMembersCollectorListTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamMembersCollectorListType> get serializer => _$TeamMembersCollectorListTypeSerializer();
}

class _$TeamMembersCollectorListTypeSerializer implements PrimitiveSerializer<TeamMembersCollectorListType> {
  @override
  final Iterable<Type> types = const [TeamMembersCollectorListType, _$TeamMembersCollectorListType];

  @override
  final String wireName = r'TeamMembersCollectorListType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamMembersCollectorListType object, {
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
    yield r'siteCount';
    yield serializers.serialize(
      object.siteCount,
      specifiedType: const FullType(num),
    );
    if (object.lastVisitedVisit != null) {
      yield r'lastVisitedVisit';
      yield serializers.serialize(
        object.lastVisitedVisit,
        specifiedType: const FullType(DateTime),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamMembersCollectorListType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamMembersCollectorListTypeBuilder result,
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
        case r'siteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.siteCount = valueDes;
          break;
        case r'lastVisitedVisit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.lastVisitedVisit = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamMembersCollectorListType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamMembersCollectorListTypeBuilder();
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


