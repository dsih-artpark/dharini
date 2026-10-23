//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_site_on_disease_site_stat_data.g.dart';

/// GetSiteOnDiseaseSiteStatData
///
/// Properties:
/// * [totalPresent] 
/// * [totalPositive] 
@BuiltValue()
abstract class GetSiteOnDiseaseSiteStatData implements Built<GetSiteOnDiseaseSiteStatData, GetSiteOnDiseaseSiteStatDataBuilder> {
  @BuiltValueField(wireName: r'totalPresent')
  num get totalPresent;

  @BuiltValueField(wireName: r'totalPositive')
  num get totalPositive;

  GetSiteOnDiseaseSiteStatData._();

  factory GetSiteOnDiseaseSiteStatData([void updates(GetSiteOnDiseaseSiteStatDataBuilder b)]) = _$GetSiteOnDiseaseSiteStatData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetSiteOnDiseaseSiteStatDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetSiteOnDiseaseSiteStatData> get serializer => _$GetSiteOnDiseaseSiteStatDataSerializer();
}

class _$GetSiteOnDiseaseSiteStatDataSerializer implements PrimitiveSerializer<GetSiteOnDiseaseSiteStatData> {
  @override
  final Iterable<Type> types = const [GetSiteOnDiseaseSiteStatData, _$GetSiteOnDiseaseSiteStatData];

  @override
  final String wireName = r'GetSiteOnDiseaseSiteStatData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetSiteOnDiseaseSiteStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalPresent';
    yield serializers.serialize(
      object.totalPresent,
      specifiedType: const FullType(num),
    );
    yield r'totalPositive';
    yield serializers.serialize(
      object.totalPositive,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GetSiteOnDiseaseSiteStatData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetSiteOnDiseaseSiteStatDataBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalPresent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPresent = valueDes;
          break;
        case r'totalPositive':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalPositive = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GetSiteOnDiseaseSiteStatData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetSiteOnDiseaseSiteStatDataBuilder();
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


