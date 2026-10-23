//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/disease_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'list_disease_response.g.dart';

/// ListDiseaseResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ListDiseaseResponse implements Built<ListDiseaseResponse, ListDiseaseResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  BuiltList<DiseaseResponseData> get data;

  ListDiseaseResponse._();

  factory ListDiseaseResponse([void updates(ListDiseaseResponseBuilder b)]) = _$ListDiseaseResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ListDiseaseResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ListDiseaseResponse> get serializer => _$ListDiseaseResponseSerializer();
}

class _$ListDiseaseResponseSerializer implements PrimitiveSerializer<ListDiseaseResponse> {
  @override
  final Iterable<Type> types = const [ListDiseaseResponse, _$ListDiseaseResponse];

  @override
  final String wireName = r'ListDiseaseResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ListDiseaseResponse object, {
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
      specifiedType: const FullType(BuiltList, [FullType(DiseaseResponseData)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ListDiseaseResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ListDiseaseResponseBuilder result,
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
            specifiedType: const FullType(BuiltList, [FullType(DiseaseResponseData)]),
          ) as BuiltList<DiseaseResponseData>;
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
  ListDiseaseResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ListDiseaseResponseBuilder();
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


