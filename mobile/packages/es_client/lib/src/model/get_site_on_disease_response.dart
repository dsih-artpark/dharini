//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/get_site_on_disease_response_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_site_on_disease_response.g.dart';

/// GetSiteOnDiseaseResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class GetSiteOnDiseaseResponse implements Built<GetSiteOnDiseaseResponse, GetSiteOnDiseaseResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  GetSiteOnDiseaseResponseData get data;

  GetSiteOnDiseaseResponse._();

  factory GetSiteOnDiseaseResponse([void updates(GetSiteOnDiseaseResponseBuilder b)]) = _$GetSiteOnDiseaseResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetSiteOnDiseaseResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetSiteOnDiseaseResponse> get serializer => _$GetSiteOnDiseaseResponseSerializer();
}

class _$GetSiteOnDiseaseResponseSerializer implements PrimitiveSerializer<GetSiteOnDiseaseResponse> {
  @override
  final Iterable<Type> types = const [GetSiteOnDiseaseResponse, _$GetSiteOnDiseaseResponse];

  @override
  final String wireName = r'GetSiteOnDiseaseResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetSiteOnDiseaseResponse object, {
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
      specifiedType: const FullType(GetSiteOnDiseaseResponseData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GetSiteOnDiseaseResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetSiteOnDiseaseResponseBuilder result,
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
            specifiedType: const FullType(GetSiteOnDiseaseResponseData),
          ) as GetSiteOnDiseaseResponseData;
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
  GetSiteOnDiseaseResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetSiteOnDiseaseResponseBuilder();
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


