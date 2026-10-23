//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_collected_sample_details_dto.g.dart';

/// UpdateCollectedSampleDetailsDto
///
/// Properties:
/// * [barcode] - Visible sample identifier / barcode
/// * [collectedBy] - User UUID of the collector
/// * [collectionTime] - Sample collection date/time
@BuiltValue()
abstract class UpdateCollectedSampleDetailsDto implements Built<UpdateCollectedSampleDetailsDto, UpdateCollectedSampleDetailsDtoBuilder> {
  /// Visible sample identifier / barcode
  @BuiltValueField(wireName: r'barcode')
  String? get barcode;

  /// User UUID of the collector
  @BuiltValueField(wireName: r'collectedBy')
  String? get collectedBy;

  /// Sample collection date/time
  @BuiltValueField(wireName: r'collectionTime')
  String? get collectionTime;

  UpdateCollectedSampleDetailsDto._();

  factory UpdateCollectedSampleDetailsDto([void updates(UpdateCollectedSampleDetailsDtoBuilder b)]) = _$UpdateCollectedSampleDetailsDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateCollectedSampleDetailsDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateCollectedSampleDetailsDto> get serializer => _$UpdateCollectedSampleDetailsDtoSerializer();
}

class _$UpdateCollectedSampleDetailsDtoSerializer implements PrimitiveSerializer<UpdateCollectedSampleDetailsDto> {
  @override
  final Iterable<Type> types = const [UpdateCollectedSampleDetailsDto, _$UpdateCollectedSampleDetailsDto];

  @override
  final String wireName = r'UpdateCollectedSampleDetailsDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateCollectedSampleDetailsDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.barcode != null) {
      yield r'barcode';
      yield serializers.serialize(
        object.barcode,
        specifiedType: const FullType(String),
      );
    }
    if (object.collectedBy != null) {
      yield r'collectedBy';
      yield serializers.serialize(
        object.collectedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.collectionTime != null) {
      yield r'collectionTime';
      yield serializers.serialize(
        object.collectionTime,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateCollectedSampleDetailsDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateCollectedSampleDetailsDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'barcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.barcode = valueDes;
          break;
        case r'collectedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.collectedBy = valueDes;
          break;
        case r'collectionTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.collectionTime = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateCollectedSampleDetailsDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateCollectedSampleDetailsDtoBuilder();
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


