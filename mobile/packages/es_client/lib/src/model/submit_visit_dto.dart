//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/create_sample_on_visit_dto.dart';
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/update_visit_on_submit_dto.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'submit_visit_dto.g.dart';

/// SubmitVisitDto
///
/// Properties:
/// * [visitData] - list of sample data collected from site
/// * [samples] - list of sample data collected from site
@BuiltValue()
abstract class SubmitVisitDto implements Built<SubmitVisitDto, SubmitVisitDtoBuilder> {
  /// list of sample data collected from site
  @BuiltValueField(wireName: r'visitData')
  UpdateVisitOnSubmitDto get visitData;

  /// list of sample data collected from site
  @BuiltValueField(wireName: r'samples')
  BuiltList<CreateSampleOnVisitDto> get samples;

  SubmitVisitDto._();

  factory SubmitVisitDto([void updates(SubmitVisitDtoBuilder b)]) = _$SubmitVisitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(SubmitVisitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<SubmitVisitDto> get serializer => _$SubmitVisitDtoSerializer();
}

class _$SubmitVisitDtoSerializer implements PrimitiveSerializer<SubmitVisitDto> {
  @override
  final Iterable<Type> types = const [SubmitVisitDto, _$SubmitVisitDto];

  @override
  final String wireName = r'SubmitVisitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    SubmitVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'visitData';
    yield serializers.serialize(
      object.visitData,
      specifiedType: const FullType(UpdateVisitOnSubmitDto),
    );
    yield r'samples';
    yield serializers.serialize(
      object.samples,
      specifiedType: const FullType(BuiltList, [FullType(CreateSampleOnVisitDto)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    SubmitVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required SubmitVisitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visitData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(UpdateVisitOnSubmitDto),
          ) as UpdateVisitOnSubmitDto;
          result.visitData.replace(valueDes);
          break;
        case r'samples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(CreateSampleOnVisitDto)]),
          ) as BuiltList<CreateSampleOnVisitDto>;
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
  SubmitVisitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = SubmitVisitDtoBuilder();
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


