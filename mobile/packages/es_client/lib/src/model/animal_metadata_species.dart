//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'animal_metadata_species.g.dart';

/// AnimalMetadataSpecies
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [emojiIcon] 
@BuiltValue()
abstract class AnimalMetadataSpecies implements Built<AnimalMetadataSpecies, AnimalMetadataSpeciesBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'emojiIcon')
  String? get emojiIcon;

  AnimalMetadataSpecies._();

  factory AnimalMetadataSpecies([void updates(AnimalMetadataSpeciesBuilder b)]) = _$AnimalMetadataSpecies;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnimalMetadataSpeciesBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnimalMetadataSpecies> get serializer => _$AnimalMetadataSpeciesSerializer();
}

class _$AnimalMetadataSpeciesSerializer implements PrimitiveSerializer<AnimalMetadataSpecies> {
  @override
  final Iterable<Type> types = const [AnimalMetadataSpecies, _$AnimalMetadataSpecies];

  @override
  final String wireName = r'AnimalMetadataSpecies';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnimalMetadataSpecies object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
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
  }

  @override
  Object serialize(
    Serializers serializers,
    AnimalMetadataSpecies object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnimalMetadataSpeciesBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnimalMetadataSpecies deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnimalMetadataSpeciesBuilder();
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


