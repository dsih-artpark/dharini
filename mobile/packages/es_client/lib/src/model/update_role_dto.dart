//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_role_dto.g.dart';

/// UpdateRoleDto
///
/// Properties:
/// * [name] - Name
/// * [permissions] - Name
@BuiltValue()
abstract class UpdateRoleDto implements Built<UpdateRoleDto, UpdateRoleDtoBuilder> {
  /// Name
  @BuiltValueField(wireName: r'name')
  String? get name;

  /// Name
  @BuiltValueField(wireName: r'permissions')
  BuiltList<String>? get permissions;

  UpdateRoleDto._();

  factory UpdateRoleDto([void updates(UpdateRoleDtoBuilder b)]) = _$UpdateRoleDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateRoleDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateRoleDto> get serializer => _$UpdateRoleDtoSerializer();
}

class _$UpdateRoleDtoSerializer implements PrimitiveSerializer<UpdateRoleDto> {
  @override
  final Iterable<Type> types = const [UpdateRoleDto, _$UpdateRoleDto];

  @override
  final String wireName = r'UpdateRoleDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateRoleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.name != null) {
      yield r'name';
      yield serializers.serialize(
        object.name,
        specifiedType: const FullType(String),
      );
    }
    if (object.permissions != null) {
      yield r'permissions';
      yield serializers.serialize(
        object.permissions,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateRoleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateRoleDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.name = valueDes;
          break;
        case r'permissions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.permissions.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateRoleDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateRoleDtoBuilder();
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


