//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_super_admin_dto.g.dart';

/// CreateSuperAdminDto
///
/// Properties:
/// * [email] - Email
/// * [firstName] - First name
/// * [lastName] - Last name
/// * [contactNumber] 
/// * [role] - Role
@BuiltValue()
abstract class CreateSuperAdminDto implements Built<CreateSuperAdminDto, CreateSuperAdminDtoBuilder> {
  /// Email
  @BuiltValueField(wireName: r'email')
  String get email;

  /// First name
  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  /// Last name
  @BuiltValueField(wireName: r'lastName')
  String get lastName;

  @BuiltValueField(wireName: r'contactNumber')
  String? get contactNumber;

  /// Role
  @BuiltValueField(wireName: r'role')
  String? get role;

  CreateSuperAdminDto._();

  factory CreateSuperAdminDto([void updates(CreateSuperAdminDtoBuilder b)]) = _$CreateSuperAdminDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSuperAdminDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSuperAdminDto> get serializer => _$CreateSuperAdminDtoSerializer();
}

class _$CreateSuperAdminDtoSerializer implements PrimitiveSerializer<CreateSuperAdminDto> {
  @override
  final Iterable<Type> types = const [CreateSuperAdminDto, _$CreateSuperAdminDto];

  @override
  final String wireName = r'CreateSuperAdminDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSuperAdminDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    yield r'firstName';
    yield serializers.serialize(
      object.firstName,
      specifiedType: const FullType(String),
    );
    yield r'lastName';
    yield serializers.serialize(
      object.lastName,
      specifiedType: const FullType(String),
    );
    if (object.contactNumber != null) {
      yield r'contactNumber';
      yield serializers.serialize(
        object.contactNumber,
        specifiedType: const FullType(String),
      );
    }
    if (object.role != null) {
      yield r'role';
      yield serializers.serialize(
        object.role,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSuperAdminDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSuperAdminDtoBuilder result,
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
        case r'firstName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.firstName = valueDes;
          break;
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.lastName = valueDes;
          break;
        case r'contactNumber':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.contactNumber = valueDes;
          break;
        case r'role':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.role = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateSuperAdminDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSuperAdminDtoBuilder();
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


