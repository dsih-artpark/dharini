//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_own_profile_dto.g.dart';

/// UpdateOwnProfileDto
///
/// Properties:
/// * [firstName] 
/// * [lastName] 
/// * [designation] 
@BuiltValue()
abstract class UpdateOwnProfileDto implements Built<UpdateOwnProfileDto, UpdateOwnProfileDtoBuilder> {
  @BuiltValueField(wireName: r'firstName')
  String? get firstName;

  @BuiltValueField(wireName: r'lastName')
  String? get lastName;

  @BuiltValueField(wireName: r'designation')
  String? get designation;

  UpdateOwnProfileDto._();

  factory UpdateOwnProfileDto([void updates(UpdateOwnProfileDtoBuilder b)]) = _$UpdateOwnProfileDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateOwnProfileDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateOwnProfileDto> get serializer => _$UpdateOwnProfileDtoSerializer();
}

class _$UpdateOwnProfileDtoSerializer implements PrimitiveSerializer<UpdateOwnProfileDto> {
  @override
  final Iterable<Type> types = const [UpdateOwnProfileDto, _$UpdateOwnProfileDto];

  @override
  final String wireName = r'UpdateOwnProfileDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateOwnProfileDto object, {
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
    if (object.designation != null) {
      yield r'designation';
      yield serializers.serialize(
        object.designation,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateOwnProfileDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateOwnProfileDtoBuilder result,
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
        case r'designation':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.designation = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateOwnProfileDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateOwnProfileDtoBuilder();
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


