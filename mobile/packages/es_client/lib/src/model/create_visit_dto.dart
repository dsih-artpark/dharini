//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_visit_dto.g.dart';

/// CreateVisitDto
///
/// Properties:
/// * [siteId] - ID of the site
/// * [collectorId] - Array of collector IDs
/// * [visitScheduledAt] - Scheduled visit date-time in ISO format
/// * [visitedAt] - The date when the collector visited
/// * [comment] 
@BuiltValue()
abstract class CreateVisitDto implements Built<CreateVisitDto, CreateVisitDtoBuilder> {
  /// ID of the site
  @BuiltValueField(wireName: r'siteId')
  String get siteId;

  /// Array of collector IDs
  @BuiltValueField(wireName: r'collectorId')
  String get collectorId;

  /// Scheduled visit date-time in ISO format
  @BuiltValueField(wireName: r'visitScheduledAt')
  String get visitScheduledAt;

  /// The date when the collector visited
  @BuiltValueField(wireName: r'visitedAt')
  String? get visitedAt;

  @BuiltValueField(wireName: r'comment')
  String? get comment;

  CreateVisitDto._();

  factory CreateVisitDto([void updates(CreateVisitDtoBuilder b)]) = _$CreateVisitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateVisitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateVisitDto> get serializer => _$CreateVisitDtoSerializer();
}

class _$CreateVisitDtoSerializer implements PrimitiveSerializer<CreateVisitDto> {
  @override
  final Iterable<Type> types = const [CreateVisitDto, _$CreateVisitDto];

  @override
  final String wireName = r'CreateVisitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'siteId';
    yield serializers.serialize(
      object.siteId,
      specifiedType: const FullType(String),
    );
    yield r'collectorId';
    yield serializers.serialize(
      object.collectorId,
      specifiedType: const FullType(String),
    );
    yield r'visitScheduledAt';
    yield serializers.serialize(
      object.visitScheduledAt,
      specifiedType: const FullType(String),
    );
    if (object.visitedAt != null) {
      yield r'visitedAt';
      yield serializers.serialize(
        object.visitedAt,
        specifiedType: const FullType(String),
      );
    }
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateVisitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateVisitDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'siteId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.siteId = valueDes;
          break;
        case r'collectorId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.collectorId = valueDes;
          break;
        case r'visitScheduledAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.visitScheduledAt = valueDes;
          break;
        case r'visitedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.visitedAt = valueDes;
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
  CreateVisitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateVisitDtoBuilder();
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


