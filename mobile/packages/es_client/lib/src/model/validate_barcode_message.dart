//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'validate_barcode_message.g.dart';

/// ValidateBarcodeMessage
///
/// Properties:
/// * [success] 
/// * [isValidBarcode] 
@BuiltValue()
abstract class ValidateBarcodeMessage implements Built<ValidateBarcodeMessage, ValidateBarcodeMessageBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'isValidBarcode')
  bool get isValidBarcode;

  ValidateBarcodeMessage._();

  factory ValidateBarcodeMessage([void updates(ValidateBarcodeMessageBuilder b)]) = _$ValidateBarcodeMessage;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ValidateBarcodeMessageBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ValidateBarcodeMessage> get serializer => _$ValidateBarcodeMessageSerializer();
}

class _$ValidateBarcodeMessageSerializer implements PrimitiveSerializer<ValidateBarcodeMessage> {
  @override
  final Iterable<Type> types = const [ValidateBarcodeMessage, _$ValidateBarcodeMessage];

  @override
  final String wireName = r'ValidateBarcodeMessage';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ValidateBarcodeMessage object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'isValidBarcode';
    yield serializers.serialize(
      object.isValidBarcode,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ValidateBarcodeMessage object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ValidateBarcodeMessageBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'success':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.success = valueDes;
          break;
        case r'isValidBarcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.isValidBarcode = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ValidateBarcodeMessage deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ValidateBarcodeMessageBuilder();
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


