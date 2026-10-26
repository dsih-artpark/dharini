//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'convert_excel_response.g.dart';

/// ConvertExcelResponse
///
/// Properties:
/// * [success] 
/// * [message] 
@BuiltValue()
abstract class ConvertExcelResponse implements Built<ConvertExcelResponse, ConvertExcelResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  ConvertExcelResponse._();

  factory ConvertExcelResponse([void updates(ConvertExcelResponseBuilder b)]) = _$ConvertExcelResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ConvertExcelResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ConvertExcelResponse> get serializer => _$ConvertExcelResponseSerializer();
}

class _$ConvertExcelResponseSerializer implements PrimitiveSerializer<ConvertExcelResponse> {
  @override
  final Iterable<Type> types = const [ConvertExcelResponse, _$ConvertExcelResponse];

  @override
  final String wireName = r'ConvertExcelResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ConvertExcelResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'success';
    yield serializers.serialize(
      object.success,
      specifiedType: const FullType(bool),
    );
    yield r'message';
    yield serializers.serialize(
      object.message,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ConvertExcelResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ConvertExcelResponseBuilder result,
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
        case r'message':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.message = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ConvertExcelResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ConvertExcelResponseBuilder();
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


