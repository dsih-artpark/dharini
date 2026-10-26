//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_member_dto.g.dart';

/// CreateMemberDto
///
/// Properties:
/// * [firstName] - First name
/// * [lastName] - Last name
/// * [email] - Email
/// * [contactNumber] 
/// * [role] - Role id
/// * [project] - Project id
@BuiltValue()
abstract class CreateMemberDto implements Built<CreateMemberDto, CreateMemberDtoBuilder> {
  /// First name
  @BuiltValueField(wireName: r'firstName')
  String? get firstName;

  /// Last name
  @BuiltValueField(wireName: r'lastName')
  String? get lastName;

  /// Email
  @BuiltValueField(wireName: r'email')
  String? get email;

  @BuiltValueField(wireName: r'contactNumber')
  String? get contactNumber;

  /// Role id
  @BuiltValueField(wireName: r'role')
  JsonObject? get role;

  /// Project id
  @BuiltValueField(wireName: r'project')
  String get project;

  CreateMemberDto._();

  factory CreateMemberDto([void updates(CreateMemberDtoBuilder b)]) = _$CreateMemberDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateMemberDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateMemberDto> get serializer => _$CreateMemberDtoSerializer();
}

class _$CreateMemberDtoSerializer implements PrimitiveSerializer<CreateMemberDto> {
  @override
  final Iterable<Type> types = const [CreateMemberDto, _$CreateMemberDto];

  @override
  final String wireName = r'CreateMemberDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    if (object.email != null) {
      yield r'email';
      yield serializers.serialize(
        object.email,
        specifiedType: const FullType(String),
      );
    }
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
        specifiedType: const FullType(JsonObject),
      );
    }
    yield r'project';
    yield serializers.serialize(
      object.project,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateMemberDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateMemberDtoBuilder result,
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
        case r'lastName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lastName = valueDes;
          break;
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.email = valueDes;
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
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.role = valueDes;
          break;
        case r'project':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.project = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateMemberDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateMemberDtoBuilder();
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


