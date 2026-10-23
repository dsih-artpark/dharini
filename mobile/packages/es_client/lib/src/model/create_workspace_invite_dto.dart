//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_workspace_invite_dto.g.dart';

/// CreateWorkspaceInviteDto
///
/// Properties:
/// * [email] - Email of the person being invited
/// * [workspaceId] - Workspace UUID to invite the user into
/// * [roleId] - Workspace-scoped Role UUID to assign when the invite is accepted
/// * [firstName] 
/// * [lastName] 
@BuiltValue()
abstract class CreateWorkspaceInviteDto implements Built<CreateWorkspaceInviteDto, CreateWorkspaceInviteDtoBuilder> {
  /// Email of the person being invited
  @BuiltValueField(wireName: r'email')
  String get email;

  /// Workspace UUID to invite the user into
  @BuiltValueField(wireName: r'workspaceId')
  String get workspaceId;

  /// Workspace-scoped Role UUID to assign when the invite is accepted
  @BuiltValueField(wireName: r'roleId')
  String get roleId;

  @BuiltValueField(wireName: r'firstName')
  String? get firstName;

  @BuiltValueField(wireName: r'lastName')
  String? get lastName;

  CreateWorkspaceInviteDto._();

  factory CreateWorkspaceInviteDto([void updates(CreateWorkspaceInviteDtoBuilder b)]) = _$CreateWorkspaceInviteDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateWorkspaceInviteDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateWorkspaceInviteDto> get serializer => _$CreateWorkspaceInviteDtoSerializer();
}

class _$CreateWorkspaceInviteDtoSerializer implements PrimitiveSerializer<CreateWorkspaceInviteDto> {
  @override
  final Iterable<Type> types = const [CreateWorkspaceInviteDto, _$CreateWorkspaceInviteDto];

  @override
  final String wireName = r'CreateWorkspaceInviteDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateWorkspaceInviteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'workspaceId';
    yield serializers.serialize(
      object.workspaceId,
      specifiedType: const FullType(String),
    );
    yield r'roleId';
    yield serializers.serialize(
      object.roleId,
      specifiedType: const FullType(String),
    );
    if (object.firstName != null) {
      yield r'firstName';
      yield serializers.serialize(
        object.firstName,
        specifiedType: const FullType(String),
      );
    }
    if (object.lastName != null) {
      yield r'lastName';
      yield serializers.serialize(
        object.lastName,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateWorkspaceInviteDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateWorkspaceInviteDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.email = valueDes;
          break;
        case r'workspaceId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.workspaceId = valueDes;
          break;
        case r'roleId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.roleId = valueDes;
          break;
        case r'firstName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.firstName = valueDes;
          break;
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lastName = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateWorkspaceInviteDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateWorkspaceInviteDtoBuilder();
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


