//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/team.dart';
import 'package:es_client/src/model/user_profile_response_data_user_role.dart';
import 'package:es_client/src/model/project.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'user_profile_response_data.g.dart';

/// UserProfileResponseData
///
/// Properties:
/// * [firstName] 
/// * [roles] 
/// * [team] 
/// * [project] 
/// * [id] 
/// * [lastName] 
/// * [profilePicture] 
/// * [designation] 
/// * [contactNumber] 
/// * [address] 
/// * [email] 
@BuiltValue()
abstract class UserProfileResponseData implements Built<UserProfileResponseData, UserProfileResponseDataBuilder> {
  @BuiltValueField(wireName: r'firstName')
  String? get firstName;

  @BuiltValueField(wireName: r'roles')
  BuiltList<UserProfileResponseDataUserRole> get roles;

  @BuiltValueField(wireName: r'team')
  Team? get team;

  @BuiltValueField(wireName: r'project')
  Project? get project;

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

  UserProfileResponseData._();

  factory UserProfileResponseData([void updates(UserProfileResponseDataBuilder b)]) = _$UserProfileResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UserProfileResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UserProfileResponseData> get serializer => _$UserProfileResponseDataSerializer();
}

class _$UserProfileResponseDataSerializer implements PrimitiveSerializer<UserProfileResponseData> {
  @override
  final Iterable<Type> types = const [UserProfileResponseData, _$UserProfileResponseData];

  @override
  final String wireName = r'UserProfileResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UserProfileResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.firstName != null) {
      yield r'firstName';
      yield serializers.serialize(
        object.firstName,
        specifiedType: const FullType.nullable(String),
      );
    }
    yield r'roles';
    yield serializers.serialize(
      object.roles,
      specifiedType: const FullType(BuiltList, [FullType(UserProfileResponseDataUserRole)]),
    );
    if (object.team != null) {
      yield r'team';
      yield serializers.serialize(
        object.team,
        specifiedType: const FullType(Team),
      );
    }
    if (object.project != null) {
      yield r'project';
      yield serializers.serialize(
        object.project,
        specifiedType: const FullType(Project),
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
  }

  @override
  Object serialize(
    Serializers serializers,
    UserProfileResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UserProfileResponseDataBuilder result,
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
        case r'roles':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(UserProfileResponseDataUserRole)]),
          ) as BuiltList<UserProfileResponseDataUserRole>;
          result.roles.replace(valueDes);
          break;
        case r'team':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Team),
          ) as Team?;
          if (valueDes == null) continue;
          result.team.replace(valueDes);
          break;
        case r'project':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(Project),
          ) as Project?;
          if (valueDes == null) continue;
          result.project.replace(valueDes);
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UserProfileResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UserProfileResponseDataBuilder();
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


