//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'site_search_response_data.g.dart';

/// SiteSearchResponseData
///
/// Properties:
/// * [projectId] 
/// * [id] 
/// * [name] 
@BuiltValue()
abstract class SiteSearchResponseData implements Built<SiteSearchResponseData, SiteSearchResponseDataBuilder> {
  @BuiltValueField(wireName: r'projectId')
  String get projectId;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  SiteSearchResponseData._();

  factory SiteSearchResponseData([void updates(SiteSearchResponseDataBuilder b)]) = _$SiteSearchResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SiteSearchResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SiteSearchResponseData> get serializer => _$SiteSearchResponseDataSerializer();
}

class _$SiteSearchResponseDataSerializer implements PrimitiveSerializer<SiteSearchResponseData> {
  @override
  final Iterable<Type> types = const [SiteSearchResponseData, _$SiteSearchResponseData];

  @override
  final String wireName = r'SiteSearchResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SiteSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'projectId';
    yield serializers.serialize(
      object.projectId,
      specifiedType: const FullType(String),
    );
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SiteSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SiteSearchResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'projectId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.projectId = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SiteSearchResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SiteSearchResponseDataBuilder();
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


