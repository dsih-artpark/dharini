//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_species_dto.g.dart';

/// CreateSpeciesDto
///
/// Properties:
/// * [name] - The name of the species
/// * [emojiIcon] - Dynamic emoji for the species
/// * [abbreviation] - Abbreviation for the species
/// * [diseaseShortNames] - Applicable disease short names
/// * [active] - Active status
@BuiltValue()
abstract class CreateSpeciesDto implements Built<CreateSpeciesDto, CreateSpeciesDtoBuilder> {
  /// The name of the species
  @BuiltValueField(wireName: r'name')
  String get name;

  /// Dynamic emoji for the species
  @BuiltValueField(wireName: r'emojiIcon')
  String? get emojiIcon;

  /// Abbreviation for the species
  @BuiltValueField(wireName: r'abbreviation')
  String? get abbreviation;

  /// Applicable disease short names
  @BuiltValueField(wireName: r'diseaseShortNames')
  BuiltList<String>? get diseaseShortNames;

  /// Active status
  @BuiltValueField(wireName: r'active')
  bool? get active;

  CreateSpeciesDto._();

  factory CreateSpeciesDto([void updates(CreateSpeciesDtoBuilder b)]) = _$CreateSpeciesDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSpeciesDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSpeciesDto> get serializer => _$CreateSpeciesDtoSerializer();
}

class _$CreateSpeciesDtoSerializer implements PrimitiveSerializer<CreateSpeciesDto> {
  @override
  final Iterable<Type> types = const [CreateSpeciesDto, _$CreateSpeciesDto];

  @override
  final String wireName = r'CreateSpeciesDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSpeciesDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    if (object.emojiIcon != null) {
      yield r'emojiIcon';
      yield serializers.serialize(
        object.emojiIcon,
        specifiedType: const FullType(String),
      );
    }
    if (object.abbreviation != null) {
      yield r'abbreviation';
      yield serializers.serialize(
        object.abbreviation,
        specifiedType: const FullType(String),
      );
    }
    if (object.diseaseShortNames != null) {
      yield r'diseaseShortNames';
      yield serializers.serialize(
        object.diseaseShortNames,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.active != null) {
      yield r'active';
      yield serializers.serialize(
        object.active,
        specifiedType: const FullType(bool),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSpeciesDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSpeciesDtoBuilder result,
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
        case r'emojiIcon':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.emojiIcon = valueDes;
          break;
        case r'abbreviation':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.abbreviation = valueDes;
          break;
        case r'diseaseShortNames':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.diseaseShortNames.replace(valueDes);
          break;
        case r'active':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.active = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateSpeciesDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSpeciesDtoBuilder();
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


