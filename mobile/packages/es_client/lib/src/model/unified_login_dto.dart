//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'unified_login_dto.g.dart';

/// UnifiedLoginDto
///
/// Properties:
/// * [email] - The email used for login
/// * [phone] - The phone number used for login
@BuiltValue()
abstract class UnifiedLoginDto implements Built<UnifiedLoginDto, UnifiedLoginDtoBuilder> {
  /// The email used for login
  @BuiltValueField(wireName: r'email')
  String? get email;

  /// The phone number used for login
  @BuiltValueField(wireName: r'phone')
  String? get phone;

  UnifiedLoginDto._();

  factory UnifiedLoginDto([void updates(UnifiedLoginDtoBuilder b)]) = _$UnifiedLoginDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UnifiedLoginDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UnifiedLoginDto> get serializer => _$UnifiedLoginDtoSerializer();
}

class _$UnifiedLoginDtoSerializer implements PrimitiveSerializer<UnifiedLoginDto> {
  @override
  final Iterable<Type> types = const [UnifiedLoginDto, _$UnifiedLoginDto];

  @override
  final String wireName = r'UnifiedLoginDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UnifiedLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.email != null) {
      yield r'email';
      yield serializers.serialize(
        object.email,
        specifiedType: const FullType(String),
      );
    }
    if (object.phone != null) {
      yield r'phone';
      yield serializers.serialize(
        object.phone,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UnifiedLoginDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UnifiedLoginDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'email':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.email = valueDes;
          break;
        case r'phone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.phone = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UnifiedLoginDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UnifiedLoginDtoBuilder();
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


