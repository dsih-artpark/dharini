//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/surveillance_type_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_surveillance_type_response.g.dart';

/// ListSurveillanceTypeResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListSurveillanceTypeResponse implements Built<ListSurveillanceTypeResponse, ListSurveillanceTypeResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<SurveillanceTypeResponseData> get data;

  ListSurveillanceTypeResponse._();

  factory ListSurveillanceTypeResponse([void updates(ListSurveillanceTypeResponseBuilder b)]) = _$ListSurveillanceTypeResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListSurveillanceTypeResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListSurveillanceTypeResponse> get serializer => _$ListSurveillanceTypeResponseSerializer();
}

class _$ListSurveillanceTypeResponseSerializer implements PrimitiveSerializer<ListSurveillanceTypeResponse> {
  @override
  final Iterable<Type> types = const [ListSurveillanceTypeResponse, _$ListSurveillanceTypeResponse];

  @override
  final String wireName = r'ListSurveillanceTypeResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListSurveillanceTypeResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(SurveillanceTypeResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListSurveillanceTypeResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListSurveillanceTypeResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(SurveillanceTypeResponseData)]),
          ) as BuiltList<SurveillanceTypeResponseData>;
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
  ListSurveillanceTypeResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListSurveillanceTypeResponseBuilder();
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


