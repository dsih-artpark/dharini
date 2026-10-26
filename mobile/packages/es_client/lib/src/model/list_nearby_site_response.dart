//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/nearby_site_response_data.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_nearby_site_response.g.dart';

/// ListNearbySiteResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListNearbySiteResponse implements Built<ListNearbySiteResponse, ListNearbySiteResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<NearbySiteResponseData> get data;

  ListNearbySiteResponse._();

  factory ListNearbySiteResponse([void updates(ListNearbySiteResponseBuilder b)]) = _$ListNearbySiteResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListNearbySiteResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListNearbySiteResponse> get serializer => _$ListNearbySiteResponseSerializer();
}

class _$ListNearbySiteResponseSerializer implements PrimitiveSerializer<ListNearbySiteResponse> {
  @override
  final Iterable<Type> types = const [ListNearbySiteResponse, _$ListNearbySiteResponse];

  @override
  final String wireName = r'ListNearbySiteResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListNearbySiteResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(NearbySiteResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListNearbySiteResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListNearbySiteResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(NearbySiteResponseData)]),
          ) as BuiltList<NearbySiteResponseData>;
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
  ListNearbySiteResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListNearbySiteResponseBuilder();
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


