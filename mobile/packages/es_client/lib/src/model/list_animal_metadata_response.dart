//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/animal_metadata_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_animal_metadata_response.g.dart';

/// ListAnimalMetadataResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListAnimalMetadataResponse implements Built<ListAnimalMetadataResponse, ListAnimalMetadataResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<AnimalMetadataData> get data;

  ListAnimalMetadataResponse._();

  factory ListAnimalMetadataResponse([void updates(ListAnimalMetadataResponseBuilder b)]) = _$ListAnimalMetadataResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListAnimalMetadataResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListAnimalMetadataResponse> get serializer => _$ListAnimalMetadataResponseSerializer();
}

class _$ListAnimalMetadataResponseSerializer implements PrimitiveSerializer<ListAnimalMetadataResponse> {
  @override
  final Iterable<Type> types = const [ListAnimalMetadataResponse, _$ListAnimalMetadataResponse];

  @override
  final String wireName = r'ListAnimalMetadataResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListAnimalMetadataResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(AnimalMetadataData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListAnimalMetadataResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListAnimalMetadataResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(AnimalMetadataData)]),
          ) as BuiltList<AnimalMetadataData>;
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
  ListAnimalMetadataResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListAnimalMetadataResponseBuilder();
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


