//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/team_activity_progress_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_activity_progress_response.g.dart';

/// TeamActivityProgressResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class TeamActivityProgressResponse implements Built<TeamActivityProgressResponse, TeamActivityProgressResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  TeamActivityProgressResponseData get data;

  TeamActivityProgressResponse._();

  factory TeamActivityProgressResponse([void updates(TeamActivityProgressResponseBuilder b)]) = _$TeamActivityProgressResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamActivityProgressResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamActivityProgressResponse> get serializer => _$TeamActivityProgressResponseSerializer();
}

class _$TeamActivityProgressResponseSerializer implements PrimitiveSerializer<TeamActivityProgressResponse> {
  @override
  final Iterable<Type> types = const [TeamActivityProgressResponse, _$TeamActivityProgressResponse];

  @override
  final String wireName = r'TeamActivityProgressResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamActivityProgressResponse object, {
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
      specifiedType: const FullType(TeamActivityProgressResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamActivityProgressResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamActivityProgressResponseBuilder result,
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
            specifiedType: const FullType(TeamActivityProgressResponseData),
          ) as TeamActivityProgressResponseData;
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
  TeamActivityProgressResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamActivityProgressResponseBuilder();
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


