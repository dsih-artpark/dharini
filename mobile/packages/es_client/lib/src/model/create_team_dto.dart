//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_team_dto.g.dart';

/// CreateTeamDto
///
/// Properties:
/// * [teamName] - Name of the team
/// * [firstName] - First Name of the team admin
/// * [lastName] - LastName of the team admin
/// * [email] - Email of the team admin
/// * [contactNumber] 
/// * [isProjectViewer] - ProjectViewer of the team
@BuiltValue()
abstract class CreateTeamDto implements Built<CreateTeamDto, CreateTeamDtoBuilder> {
  /// Name of the team
  @BuiltValueField(wireName: r'teamName')
  String get teamName;

  /// First Name of the team admin
  @BuiltValueField(wireName: r'firstName')
  String get firstName;

  /// LastName of the team admin
  @BuiltValueField(wireName: r'lastName')
  String get lastName;

  /// Email of the team admin
  @BuiltValueField(wireName: r'email')
  String get email;

  @BuiltValueField(wireName: r'contactNumber')
  String? get contactNumber;

  /// ProjectViewer of the team
  @BuiltValueField(wireName: r'isProjectViewer')
  bool get isProjectViewer;

  CreateTeamDto._();

  factory CreateTeamDto([void updates(CreateTeamDtoBuilder b)]) = _$CreateTeamDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateTeamDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateTeamDto> get serializer => _$CreateTeamDtoSerializer();
}

class _$CreateTeamDtoSerializer implements PrimitiveSerializer<CreateTeamDto> {
  @override
  final Iterable<Type> types = const [CreateTeamDto, _$CreateTeamDto];

  @override
  final String wireName = r'CreateTeamDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateTeamDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'teamName';
    yield serializers.serialize(
      object.teamName,
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
    yield r'email';
    yield serializers.serialize(
      object.email,
      specifiedType: const FullType(String),
    );
    if (object.contactNumber != null) {
      yield r'contactNumber';
      yield serializers.serialize(
        object.contactNumber,
        specifiedType: const FullType(String),
      );
    }
    yield r'isProjectViewer';
    yield serializers.serialize(
      object.isProjectViewer,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateTeamDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateTeamDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'teamName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.teamName = valueDes;
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
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
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
        case r'isProjectViewer':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.isProjectViewer = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateTeamDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateTeamDtoBuilder();
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


