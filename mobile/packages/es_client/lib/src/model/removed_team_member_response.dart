//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'removed_team_member_response.g.dart';

/// RemovedTeamMemberResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [removedMembers] 
@BuiltValue()
abstract class RemovedTeamMemberResponse implements Built<RemovedTeamMemberResponse, RemovedTeamMemberResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'removedMembers')
  BuiltList<String> get removedMembers;

  RemovedTeamMemberResponse._();

  factory RemovedTeamMemberResponse([void updates(RemovedTeamMemberResponseBuilder b)]) = _$RemovedTeamMemberResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RemovedTeamMemberResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RemovedTeamMemberResponse> get serializer => _$RemovedTeamMemberResponseSerializer();
}

class _$RemovedTeamMemberResponseSerializer implements PrimitiveSerializer<RemovedTeamMemberResponse> {
  @override
  final Iterable<Type> types = const [RemovedTeamMemberResponse, _$RemovedTeamMemberResponse];

  @override
  final String wireName = r'RemovedTeamMemberResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RemovedTeamMemberResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
    yield r'removedMembers';
    yield serializers.serialize(
      object.removedMembers,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RemovedTeamMemberResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RemovedTeamMemberResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'success':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.success = valueDes;
          break;
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        case r'removedMembers':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.removedMembers.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RemovedTeamMemberResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RemovedTeamMemberResponseBuilder();
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


