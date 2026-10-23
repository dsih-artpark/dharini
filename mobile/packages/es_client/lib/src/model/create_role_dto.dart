//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_role_dto.g.dart';

/// CreateRoleDto
///
/// Properties:
/// * [name] - Name
/// * [permissions] - Permissions
@BuiltValue()
abstract class CreateRoleDto implements Built<CreateRoleDto, CreateRoleDtoBuilder> {
  /// Name
  @BuiltValueField(wireName: r'name')
  String get name;

  /// Permissions
  @BuiltValueField(wireName: r'permissions')
  BuiltList<String> get permissions;

  CreateRoleDto._();

  factory CreateRoleDto([void updates(CreateRoleDtoBuilder b)]) = _$CreateRoleDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateRoleDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateRoleDto> get serializer => _$CreateRoleDtoSerializer();
}

class _$CreateRoleDtoSerializer implements PrimitiveSerializer<CreateRoleDto> {
  @override
  final Iterable<Type> types = const [CreateRoleDto, _$CreateRoleDto];

  @override
  final String wireName = r'CreateRoleDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateRoleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'permissions';
    yield serializers.serialize(
      object.permissions,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateRoleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateRoleDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        case r'permissions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
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
  CreateRoleDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateRoleDtoBuilder();
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


