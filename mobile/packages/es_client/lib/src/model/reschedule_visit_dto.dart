//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'reschedule_visit_dto.g.dart';

/// RescheduleVisitDto
///
/// Properties:
/// * [newScheduledDate] - New scheduled visit date-time in ISO format
@BuiltValue()
abstract class RescheduleVisitDto implements Built<RescheduleVisitDto, RescheduleVisitDtoBuilder> {
  /// New scheduled visit date-time in ISO format
  @BuiltValueField(wireName: r'newScheduledDate')
  String get newScheduledDate;

  RescheduleVisitDto._();

  factory RescheduleVisitDto([void updates(RescheduleVisitDtoBuilder b)]) = _$RescheduleVisitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RescheduleVisitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RescheduleVisitDto> get serializer => _$RescheduleVisitDtoSerializer();
}

class _$RescheduleVisitDtoSerializer implements PrimitiveSerializer<RescheduleVisitDto> {
  @override
  final Iterable<Type> types = const [RescheduleVisitDto, _$RescheduleVisitDto];

  @override
  final String wireName = r'RescheduleVisitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RescheduleVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'newScheduledDate';
    yield serializers.serialize(
      object.newScheduledDate,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RescheduleVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RescheduleVisitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'newScheduledDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.newScheduledDate = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RescheduleVisitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RescheduleVisitDtoBuilder();
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


