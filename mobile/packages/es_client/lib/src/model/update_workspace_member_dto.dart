//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_workspace_member_dto.g.dart';

/// UpdateWorkspaceMemberDto
///
/// Properties:
/// * [roleId] - Workspace-scoped Role UUID to assign
@BuiltValue()
abstract class UpdateWorkspaceMemberDto implements Built<UpdateWorkspaceMemberDto, UpdateWorkspaceMemberDtoBuilder> {
  /// Workspace-scoped Role UUID to assign
  @BuiltValueField(wireName: r'roleId')
  String get roleId;

  UpdateWorkspaceMemberDto._();

  factory UpdateWorkspaceMemberDto([void updates(UpdateWorkspaceMemberDtoBuilder b)]) = _$UpdateWorkspaceMemberDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateWorkspaceMemberDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateWorkspaceMemberDto> get serializer => _$UpdateWorkspaceMemberDtoSerializer();
}

class _$UpdateWorkspaceMemberDtoSerializer implements PrimitiveSerializer<UpdateWorkspaceMemberDto> {
  @override
  final Iterable<Type> types = const [UpdateWorkspaceMemberDto, _$UpdateWorkspaceMemberDto];

  @override
  final String wireName = r'UpdateWorkspaceMemberDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateWorkspaceMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'roleId';
    yield serializers.serialize(
      object.roleId,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateWorkspaceMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateWorkspaceMemberDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
  UpdateWorkspaceMemberDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateWorkspaceMemberDtoBuilder();
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


