//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/sample_type_response_data.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_sample_type_response.g.dart';

/// ListSampleTypeResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListSampleTypeResponse implements Built<ListSampleTypeResponse, ListSampleTypeResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<SampleTypeResponseData> get data;

  ListSampleTypeResponse._();

  factory ListSampleTypeResponse([void updates(ListSampleTypeResponseBuilder b)]) = _$ListSampleTypeResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListSampleTypeResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListSampleTypeResponse> get serializer => _$ListSampleTypeResponseSerializer();
}

class _$ListSampleTypeResponseSerializer implements PrimitiveSerializer<ListSampleTypeResponse> {
  @override
  final Iterable<Type> types = const [ListSampleTypeResponse, _$ListSampleTypeResponse];

  @override
  final String wireName = r'ListSampleTypeResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListSampleTypeResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(SampleTypeResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListSampleTypeResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListSampleTypeResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(SampleTypeResponseData)]),
          ) as BuiltList<SampleTypeResponseData>;
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
  ListSampleTypeResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListSampleTypeResponseBuilder();
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


