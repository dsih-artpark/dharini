//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/user_role.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'team_member_response_data.g.dart';

/// TeamMemberResponseData
///
/// Properties:
/// * [firstName] 
/// * [id] 
/// * [lastName] 
/// * [profilePicture] 
/// * [designation] 
/// * [contactNumber] 
/// * [address] 
/// * [email] 
/// * [roles] 
@BuiltValue()
abstract class TeamMemberResponseData implements Built<TeamMemberResponseData, TeamMemberResponseDataBuilder> {
  @BuiltValueField(wireName: r'firstName')
  String? get firstName;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'lastName')
  String? get lastName;

  @BuiltValueField(wireName: r'profilePicture')
  String? get profilePicture;

  @BuiltValueField(wireName: r'designation')
  String? get designation;

  @BuiltValueField(wireName: r'contactNumber')
  String? get contactNumber;

  @BuiltValueField(wireName: r'address')
  String? get address;

  @BuiltValueField(wireName: r'email')
  String? get email;

  @BuiltValueField(wireName: r'roles')
  BuiltList<UserRole>? get roles;

  TeamMemberResponseData._();

  factory TeamMemberResponseData([void updates(TeamMemberResponseDataBuilder b)]) = _$TeamMemberResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TeamMemberResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TeamMemberResponseData> get serializer => _$TeamMemberResponseDataSerializer();
}

class _$TeamMemberResponseDataSerializer implements PrimitiveSerializer<TeamMemberResponseData> {
  @override
  final Iterable<Type> types = const [TeamMemberResponseData, _$TeamMemberResponseData];

  @override
  final String wireName = r'TeamMemberResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TeamMemberResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.firstName != null) {
      yield r'firstName';
      yield serializers.serialize(
        object.firstName,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.lastName != null) {
      yield r'lastName';
      yield serializers.serialize(
        object.lastName,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.profilePicture != null) {
      yield r'profilePicture';
      yield serializers.serialize(
        object.profilePicture,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.designation != null) {
      yield r'designation';
      yield serializers.serialize(
        object.designation,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'contactNumber';
    yield object.contactNumber == null ? null : serializers.serialize(
      object.contactNumber,
      specifiedType: const FullType.nullable(String),
    );
    if (object.address != null) {
      yield r'address';
      yield serializers.serialize(
        object.address,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.email != null) {
      yield r'email';
      yield serializers.serialize(
        object.email,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.roles != null) {
      yield r'roles';
      yield serializers.serialize(
        object.roles,
        specifiedType: const FullType(BuiltList, [FullType(UserRole)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    TeamMemberResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TeamMemberResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'firstName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.firstName = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lastName = valueDes;
          break;
        case r'profilePicture':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.profilePicture = valueDes;
          break;
        case r'designation':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.designation = valueDes;
          break;
        case r'contactNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.contactNumber = valueDes;
          break;
        case r'address':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.address = valueDes;
          break;
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.email = valueDes;
          break;
        case r'roles':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(UserRole)]),
          ) as BuiltList<UserRole>?;
          if (valueDes == null) continue;
          result.roles.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TeamMemberResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TeamMemberResponseDataBuilder();
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


