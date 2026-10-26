//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'disease_search_response_data.g.dart';

/// DiseaseSearchResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
@BuiltValue()
abstract class DiseaseSearchResponseData implements Built<DiseaseSearchResponseData, DiseaseSearchResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  DiseaseSearchResponseData._();

  factory DiseaseSearchResponseData([void updates(DiseaseSearchResponseDataBuilder b)]) = _$DiseaseSearchResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DiseaseSearchResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DiseaseSearchResponseData> get serializer => _$DiseaseSearchResponseDataSerializer();
}

class _$DiseaseSearchResponseDataSerializer implements PrimitiveSerializer<DiseaseSearchResponseData> {
  @override
  final Iterable<Type> types = const [DiseaseSearchResponseData, _$DiseaseSearchResponseData];

  @override
  final String wireName = r'DiseaseSearchResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DiseaseSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
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
    DiseaseSearchResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DiseaseSearchResponseDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
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
  DiseaseSearchResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DiseaseSearchResponseDataBuilder();
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


