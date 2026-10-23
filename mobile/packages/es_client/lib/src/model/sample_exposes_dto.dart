//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'sample_exposes_dto.g.dart';

/// SampleExposesDto
///
/// Properties:
/// * [collectedAt] 
/// * [collectionTime] 
/// * [comment] 
@BuiltValue()
abstract class SampleExposesDto implements Built<SampleExposesDto, SampleExposesDtoBuilder> {
  @BuiltValueField(wireName: r'collectedAt')
  DateTime get collectedAt;

  @BuiltValueField(wireName: r'collectionTime')
  DateTime get collectionTime;

  @BuiltValueField(wireName: r'comment')
  String? get comment;

  SampleExposesDto._();

  factory SampleExposesDto([void updates(SampleExposesDtoBuilder b)]) = _$SampleExposesDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SampleExposesDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SampleExposesDto> get serializer => _$SampleExposesDtoSerializer();
}

class _$SampleExposesDtoSerializer implements PrimitiveSerializer<SampleExposesDto> {
  @override
  final Iterable<Type> types = const [SampleExposesDto, _$SampleExposesDto];

  @override
  final String wireName = r'SampleExposesDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SampleExposesDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'collectedAt';
    yield serializers.serialize(
      object.collectedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'collectionTime';
    yield serializers.serialize(
      object.collectionTime,
      specifiedType: const FullType(DateTime),
    );
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType.nullable(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    SampleExposesDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SampleExposesDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'collectedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.collectedAt = valueDes;
          break;
        case r'collectionTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.collectionTime = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  SampleExposesDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SampleExposesDtoBuilder();
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


