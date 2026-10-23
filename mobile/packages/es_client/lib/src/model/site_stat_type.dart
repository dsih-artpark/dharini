//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'site_stat_type.g.dart';

/// SiteStatType
///
/// Properties:
/// * [district] 
/// * [positiveCount] 
/// * [totalSiteCount] 
@BuiltValue()
abstract class SiteStatType implements Built<SiteStatType, SiteStatTypeBuilder> {
  @BuiltValueField(wireName: r'district')
  String get district;

  @BuiltValueField(wireName: r'positiveCount')
  num get positiveCount;

  @BuiltValueField(wireName: r'totalSiteCount')
  num get totalSiteCount;

  SiteStatType._();

  factory SiteStatType([void updates(SiteStatTypeBuilder b)]) = _$SiteStatType;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SiteStatTypeBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SiteStatType> get serializer => _$SiteStatTypeSerializer();
}

class _$SiteStatTypeSerializer implements PrimitiveSerializer<SiteStatType> {
  @override
  final Iterable<Type> types = const [SiteStatType, _$SiteStatType];

  @override
  final String wireName = r'SiteStatType';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SiteStatType object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'district';
    yield serializers.serialize(
      object.district,
      specifiedType: const FullType(String),
    );
    yield r'positiveCount';
    yield serializers.serialize(
      object.positiveCount,
      specifiedType: const FullType(num),
    );
    yield r'totalSiteCount';
    yield serializers.serialize(
      object.totalSiteCount,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SiteStatType object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SiteStatTypeBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'district':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.district = valueDes;
          break;
        case r'positiveCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positiveCount = valueDes;
          break;
        case r'totalSiteCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSiteCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SiteStatType deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SiteStatTypeBuilder();
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


