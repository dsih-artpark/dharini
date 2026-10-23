//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_member_remove_dto.g.dart';

/// TeamMemberRemoveDto
///
/// Properties:
/// * [teamId] - Team id
/// * [memberIds] - User id
@BuiltValue()
abstract class TeamMemberRemoveDto implements Built<TeamMemberRemoveDto, TeamMemberRemoveDtoBuilder> {
  /// Team id
  @BuiltValueField(wireName: r'teamId')
  String get teamId;

  /// User id
  @BuiltValueField(wireName: r'memberIds')
  BuiltList<String> get memberIds;

  TeamMemberRemoveDto._();

  factory TeamMemberRemoveDto([void updates(TeamMemberRemoveDtoBuilder b)]) = _$TeamMemberRemoveDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamMemberRemoveDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamMemberRemoveDto> get serializer => _$TeamMemberRemoveDtoSerializer();
}

class _$TeamMemberRemoveDtoSerializer implements PrimitiveSerializer<TeamMemberRemoveDto> {
  @override
  final Iterable<Type> types = const [TeamMemberRemoveDto, _$TeamMemberRemoveDto];

  @override
  final String wireName = r'TeamMemberRemoveDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamMemberRemoveDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'teamId';
    yield serializers.serialize(
      object.teamId,
      specifiedType: const FullType(String),
    );
    yield r'memberIds';
    yield serializers.serialize(
      object.memberIds,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamMemberRemoveDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamMemberRemoveDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'teamId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.teamId = valueDes;
          break;
        case r'memberIds':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.memberIds.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamMemberRemoveDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamMemberRemoveDtoBuilder();
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


