//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_project_dto.g.dart';

/// UpdateProjectDto
///
/// Properties:
/// * [name] - Name of the project
/// * [code] - Code associated with the project
/// * [diseases] - Unique identifier for the disease
/// * [surveillanceTypes] - List of unique identifiers for surveillance types
/// * [regions] - List of unique identifiers for locations
/// * [teams] - Email associated with the project
@BuiltValue()
abstract class UpdateProjectDto implements Built<UpdateProjectDto, UpdateProjectDtoBuilder> {
  /// Name of the project
  @BuiltValueField(wireName: r'name')
  String? get name;

  /// Code associated with the project
  @BuiltValueField(wireName: r'code')
  String? get code;

  /// Unique identifier for the disease
  @BuiltValueField(wireName: r'diseases')
  BuiltList<String>? get diseases;

  /// List of unique identifiers for surveillance types
  @BuiltValueField(wireName: r'surveillanceTypes')
  BuiltList<String>? get surveillanceTypes;

  /// List of unique identifiers for locations
  @BuiltValueField(wireName: r'regions')
  BuiltList<String>? get regions;

  /// Email associated with the project
  @BuiltValueField(wireName: r'teams')
  BuiltList<JsonObject>? get teams;

  UpdateProjectDto._();

  factory UpdateProjectDto([void updates(UpdateProjectDtoBuilder b)]) = _$UpdateProjectDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateProjectDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateProjectDto> get serializer => _$UpdateProjectDtoSerializer();
}

class _$UpdateProjectDtoSerializer implements PrimitiveSerializer<UpdateProjectDto> {
  @override
  final Iterable<Type> types = const [UpdateProjectDto, _$UpdateProjectDto];

  @override
  final String wireName = r'UpdateProjectDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateProjectDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.name != null) {
      yield r'name';
      yield serializers.serialize(
        object.name,
        specifiedType: const FullType(String),
      );
    }
    if (object.code != null) {
      yield r'code';
      yield serializers.serialize(
        object.code,
        specifiedType: const FullType(String),
      );
    }
    if (object.diseases != null) {
      yield r'diseases';
      yield serializers.serialize(
        object.diseases,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.surveillanceTypes != null) {
      yield r'surveillanceTypes';
      yield serializers.serialize(
        object.surveillanceTypes,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.regions != null) {
      yield r'regions';
      yield serializers.serialize(
        object.regions,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.teams != null) {
      yield r'teams';
      yield serializers.serialize(
        object.teams,
        specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateProjectDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateProjectDtoBuilder result,
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
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.code = valueDes;
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseases.replace(valueDes);
          break;
        case r'surveillanceTypes':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.surveillanceTypes.replace(valueDes);
          break;
        case r'regions':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.regions.replace(valueDes);
          break;
        case r'teams':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>?;
          if (valueDes == null) continue;
          result.teams.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateProjectDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateProjectDtoBuilder();
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


