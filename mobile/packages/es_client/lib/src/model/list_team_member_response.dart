//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/team_member_response_data.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_team_member_response.g.dart';

/// ListTeamMemberResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListTeamMemberResponse implements Built<ListTeamMemberResponse, ListTeamMemberResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<TeamMemberResponseData> get data;

  ListTeamMemberResponse._();

  factory ListTeamMemberResponse([void updates(ListTeamMemberResponseBuilder b)]) = _$ListTeamMemberResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListTeamMemberResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListTeamMemberResponse> get serializer => _$ListTeamMemberResponseSerializer();
}

class _$ListTeamMemberResponseSerializer implements PrimitiveSerializer<ListTeamMemberResponse> {
  @override
  final Iterable<Type> types = const [ListTeamMemberResponse, _$ListTeamMemberResponse];

  @override
  final String wireName = r'ListTeamMemberResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListTeamMemberResponse object, {
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
    yield r'data';
    yield serializers.serialize(
      object.data,
      specifiedType: const FullType(BuiltList, [FullType(TeamMemberResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListTeamMemberResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListTeamMemberResponseBuilder result,
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
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TeamMemberResponseData)]),
          ) as BuiltList<TeamMemberResponseData>;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ListTeamMemberResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListTeamMemberResponseBuilder();
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


