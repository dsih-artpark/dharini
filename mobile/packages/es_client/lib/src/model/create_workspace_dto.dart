//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_workspace_dto.g.dart';

/// CreateWorkspaceDto
///
/// Properties:
/// * [name] 
@BuiltValue()
abstract class CreateWorkspaceDto implements Built<CreateWorkspaceDto, CreateWorkspaceDtoBuilder> {
  @BuiltValueField(wireName: r'name')
  String get name;

  CreateWorkspaceDto._();

  factory CreateWorkspaceDto([void updates(CreateWorkspaceDtoBuilder b)]) = _$CreateWorkspaceDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateWorkspaceDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateWorkspaceDto> get serializer => _$CreateWorkspaceDtoSerializer();
}

class _$CreateWorkspaceDtoSerializer implements PrimitiveSerializer<CreateWorkspaceDto> {
  @override
  final Iterable<Type> types = const [CreateWorkspaceDto, _$CreateWorkspaceDto];

  @override
  final String wireName = r'CreateWorkspaceDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateWorkspaceDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateWorkspaceDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateWorkspaceDtoBuilder result,
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateWorkspaceDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateWorkspaceDtoBuilder();
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


