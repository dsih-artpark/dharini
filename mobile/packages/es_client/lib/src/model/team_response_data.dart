//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/user.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_response_data.g.dart';

/// TeamResponseData
///
/// Properties:
/// * [id] 
/// * [teamName] 
/// * [address] 
/// * [logo] 
/// * [members] 
@BuiltValue()
abstract class TeamResponseData implements Built<TeamResponseData, TeamResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'teamName')
  String? get teamName;

  @BuiltValueField(wireName: r'address')
  String? get address;

  @BuiltValueField(wireName: r'logo')
  String? get logo;

  @BuiltValueField(wireName: r'members')
  BuiltList<User>? get members;

  TeamResponseData._();

  factory TeamResponseData([void updates(TeamResponseDataBuilder b)]) = _$TeamResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamResponseData> get serializer => _$TeamResponseDataSerializer();
}

class _$TeamResponseDataSerializer implements PrimitiveSerializer<TeamResponseData> {
  @override
  final Iterable<Type> types = const [TeamResponseData, _$TeamResponseData];

  @override
  final String wireName = r'TeamResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.teamName != null) {
      yield r'teamName';
      yield serializers.serialize(
        object.teamName,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.address != null) {
      yield r'address';
      yield serializers.serialize(
        object.address,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.logo != null) {
      yield r'logo';
      yield serializers.serialize(
        object.logo,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.members != null) {
      yield r'members';
      yield serializers.serialize(
        object.members,
        specifiedType: const FullType(BuiltList, [FullType(User)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamResponseDataBuilder result,
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
        case r'teamName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.teamName = valueDes;
          break;
        case r'address':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.address = valueDes;
          break;
        case r'logo':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.logo = valueDes;
          break;
        case r'members':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(User)]),
          ) as BuiltList<User>?;
          if (valueDes == null) continue;
          result.members.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamResponseDataBuilder();
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


