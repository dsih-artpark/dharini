//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_break_down_response_data.g.dart';

/// SampleBreakDownResponseData
///
/// Properties:
/// * [id] 
/// * [name] 
/// * [code] 
/// * [photos] 
/// * [locationId] 
/// * [state] 
/// * [district] 
/// * [totalSampleCount] 
/// * [positiveSampleCount] 
/// * [negativeSampleCount] 
/// * [unclearSampleCount] 
@BuiltValue()
abstract class SampleBreakDownResponseData implements Built<SampleBreakDownResponseData, SampleBreakDownResponseDataBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'photos')
  BuiltList<String> get photos;

  @BuiltValueField(wireName: r'locationId')
  String get locationId;

  @BuiltValueField(wireName: r'state')
  String get state;

  @BuiltValueField(wireName: r'district')
  String get district;

  @BuiltValueField(wireName: r'totalSampleCount')
  num get totalSampleCount;

  @BuiltValueField(wireName: r'positiveSampleCount')
  num get positiveSampleCount;

  @BuiltValueField(wireName: r'negativeSampleCount')
  num get negativeSampleCount;

  @BuiltValueField(wireName: r'unclearSampleCount')
  num get unclearSampleCount;

  SampleBreakDownResponseData._();

  factory SampleBreakDownResponseData([void updates(SampleBreakDownResponseDataBuilder b)]) = _$SampleBreakDownResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleBreakDownResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleBreakDownResponseData> get serializer => _$SampleBreakDownResponseDataSerializer();
}

class _$SampleBreakDownResponseDataSerializer implements PrimitiveSerializer<SampleBreakDownResponseData> {
  @override
  final Iterable<Type> types = const [SampleBreakDownResponseData, _$SampleBreakDownResponseData];

  @override
  final String wireName = r'SampleBreakDownResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleBreakDownResponseData object, {
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
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'photos';
    yield serializers.serialize(
      object.photos,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'locationId';
    yield serializers.serialize(
      object.locationId,
      specifiedType: const FullType(String),
    );
    yield r'state';
    yield serializers.serialize(
      object.state,
      specifiedType: const FullType(String),
    );
    yield r'district';
    yield serializers.serialize(
      object.district,
      specifiedType: const FullType(String),
    );
    yield r'totalSampleCount';
    yield serializers.serialize(
      object.totalSampleCount,
      specifiedType: const FullType(num),
    );
    yield r'positiveSampleCount';
    yield serializers.serialize(
      object.positiveSampleCount,
      specifiedType: const FullType(num),
    );
    yield r'negativeSampleCount';
    yield serializers.serialize(
      object.negativeSampleCount,
      specifiedType: const FullType(num),
    );
    yield r'unclearSampleCount';
    yield serializers.serialize(
      object.unclearSampleCount,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SampleBreakDownResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleBreakDownResponseDataBuilder result,
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
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.photos.replace(valueDes);
          break;
        case r'locationId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.locationId = valueDes;
          break;
        case r'state':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.state = valueDes;
          break;
        case r'district':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.district = valueDes;
          break;
        case r'totalSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalSampleCount = valueDes;
          break;
        case r'positiveSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.positiveSampleCount = valueDes;
          break;
        case r'negativeSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.negativeSampleCount = valueDes;
          break;
        case r'unclearSampleCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.unclearSampleCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SampleBreakDownResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleBreakDownResponseDataBuilder();
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


