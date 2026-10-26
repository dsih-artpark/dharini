//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/sample_dto.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_dto.g.dart';

/// VisitDto
///
/// Properties:
/// * [visitId] 
/// * [visitData] 
/// * [samples] 
@BuiltValue()
abstract class VisitDto implements Built<VisitDto, VisitDtoBuilder> {
  @BuiltValueField(wireName: r'visitId')
  String get visitId;

  @BuiltValueField(wireName: r'visitData')
  JsonObject get visitData;

  @BuiltValueField(wireName: r'samples')
  BuiltList<SampleDto> get samples;

  VisitDto._();

  factory VisitDto([void updates(VisitDtoBuilder b)]) = _$VisitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitDto> get serializer => _$VisitDtoSerializer();
}

class _$VisitDtoSerializer implements PrimitiveSerializer<VisitDto> {
  @override
  final Iterable<Type> types = const [VisitDto, _$VisitDto];

  @override
  final String wireName = r'VisitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'visitId';
    yield serializers.serialize(
      object.visitId,
      specifiedType: const FullType(String),
    );
    yield r'visitData';
    yield serializers.serialize(
      object.visitData,
      specifiedType: const FullType(JsonObject),
    );
    yield r'samples';
    yield serializers.serialize(
      object.samples,
      specifiedType: const FullType(BuiltList, [FullType(SampleDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    VisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visitId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.visitId = valueDes;
          break;
        case r'visitData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.visitData = valueDes;
          break;
        case r'samples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(SampleDto)]),
          ) as BuiltList<SampleDto>;
          result.samples.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  VisitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitDtoBuilder();
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


