//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/most_positive_site_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'most_positive_site_response.g.dart';

/// MostPositiveSiteResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class MostPositiveSiteResponse implements Built<MostPositiveSiteResponse, MostPositiveSiteResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  MostPositiveSiteResponseData get data;

  MostPositiveSiteResponse._();

  factory MostPositiveSiteResponse([void updates(MostPositiveSiteResponseBuilder b)]) = _$MostPositiveSiteResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(MostPositiveSiteResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<MostPositiveSiteResponse> get serializer => _$MostPositiveSiteResponseSerializer();
}

class _$MostPositiveSiteResponseSerializer implements PrimitiveSerializer<MostPositiveSiteResponse> {
  @override
  final Iterable<Type> types = const [MostPositiveSiteResponse, _$MostPositiveSiteResponse];

  @override
  final String wireName = r'MostPositiveSiteResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    MostPositiveSiteResponse object, {
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
    yield r'data';
    yield serializers.serialize(
      object.data,
      specifiedType: const FullType(MostPositiveSiteResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    MostPositiveSiteResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required MostPositiveSiteResponseBuilder result,
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
        case r'data':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(MostPositiveSiteResponseData),
          ) as MostPositiveSiteResponseData;
          result.data.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  MostPositiveSiteResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = MostPositiveSiteResponseBuilder();
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


