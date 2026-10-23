//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_workspace_member_dto.g.dart';

/// CreateWorkspaceMemberDto
///
/// Properties:
/// * [userId] - User UUID to add to the workspace
/// * [roleId] - Workspace-scoped Role UUID to assign
@BuiltValue()
abstract class CreateWorkspaceMemberDto implements Built<CreateWorkspaceMemberDto, CreateWorkspaceMemberDtoBuilder> {
  /// User UUID to add to the workspace
  @BuiltValueField(wireName: r'userId')
  String get userId;

  /// Workspace-scoped Role UUID to assign
  @BuiltValueField(wireName: r'roleId')
  String get roleId;

  CreateWorkspaceMemberDto._();

  factory CreateWorkspaceMemberDto([void updates(CreateWorkspaceMemberDtoBuilder b)]) = _$CreateWorkspaceMemberDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateWorkspaceMemberDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateWorkspaceMemberDto> get serializer => _$CreateWorkspaceMemberDtoSerializer();
}

class _$CreateWorkspaceMemberDtoSerializer implements PrimitiveSerializer<CreateWorkspaceMemberDto> {
  @override
  final Iterable<Type> types = const [CreateWorkspaceMemberDto, _$CreateWorkspaceMemberDto];

  @override
  final String wireName = r'CreateWorkspaceMemberDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateWorkspaceMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(String),
    );
    yield r'roleId';
    yield serializers.serialize(
      object.roleId,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateWorkspaceMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateWorkspaceMemberDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userId = valueDes;
          break;
        case r'roleId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.roleId = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateWorkspaceMemberDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateWorkspaceMemberDtoBuilder();
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


