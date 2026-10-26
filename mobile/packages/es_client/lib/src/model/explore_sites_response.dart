//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/explore_site_data.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'explore_sites_response.g.dart';

/// ExploreSitesResponse
///
/// Properties:
/// * [success] 
/// * [message] 
/// * [data] 
@BuiltValue()
abstract class ExploreSitesResponse implements Built<ExploreSitesResponse, ExploreSitesResponseBuilder> {
  @BuiltValueField(wireName: r'success')
  bool get success;

  @BuiltValueField(wireName: r'message')
  String get message;

  @BuiltValueField(wireName: r'data')
  ExploreSiteData get data;

  ExploreSitesResponse._();

  factory ExploreSitesResponse([void updates(ExploreSitesResponseBuilder b)]) = _$ExploreSitesResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ExploreSitesResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ExploreSitesResponse> get serializer => _$ExploreSitesResponseSerializer();
}

class _$ExploreSitesResponseSerializer implements PrimitiveSerializer<ExploreSitesResponse> {
  @override
  final Iterable<Type> types = const [ExploreSitesResponse, _$ExploreSitesResponse];

  @override
  final String wireName = r'ExploreSitesResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ExploreSitesResponse object, {
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
      specifiedType: const FullType(ExploreSiteData),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ExploreSitesResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ExploreSitesResponseBuilder result,
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
            specifiedType: const FullType(ExploreSiteData),
          ) as ExploreSiteData;
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
  ExploreSitesResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ExploreSitesResponseBuilder();
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


