//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_workspace_dto.g.dart';

/// UpdateWorkspaceDto
///
/// Properties:
/// * [name] - New workspace name
@BuiltValue()
abstract class UpdateWorkspaceDto implements Built<UpdateWorkspaceDto, UpdateWorkspaceDtoBuilder> {
  /// New workspace name
  @BuiltValueField(wireName: r'name')
  String get name;

  UpdateWorkspaceDto._();

  factory UpdateWorkspaceDto([void updates(UpdateWorkspaceDtoBuilder b)]) = _$UpdateWorkspaceDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateWorkspaceDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateWorkspaceDto> get serializer => _$UpdateWorkspaceDtoSerializer();
}

class _$UpdateWorkspaceDtoSerializer implements PrimitiveSerializer<UpdateWorkspaceDto> {
  @override
  final Iterable<Type> types = const [UpdateWorkspaceDto, _$UpdateWorkspaceDto];

  @override
  final String wireName = r'UpdateWorkspaceDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateWorkspaceDto object, {
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
    UpdateWorkspaceDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateWorkspaceDtoBuilder result,
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
  UpdateWorkspaceDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateWorkspaceDtoBuilder();
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


