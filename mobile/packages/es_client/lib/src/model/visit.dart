//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:es_client/src/model/visit_status.dart';
import 'package:es_client/src/model/user.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit.g.dart';

/// Visit
///
/// Properties:
/// * [visitStartedAt] - Timestamp when the collector opened the page
/// * [visitStatus] 
/// * [visitedBy] 
/// * [collector] 
/// * [id] 
/// * [visitedAt] 
/// * [visitScheduledAt] 
/// * [comment] 
/// * [isCompleted] 
/// * [rescheduledFrom] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class Visit implements Built<Visit, VisitBuilder> {
  /// Timestamp when the collector opened the page
  @BuiltValueField(wireName: r'visitStartedAt')
  DateTime? get visitStartedAt;

  @BuiltValueField(wireName: r'visitStatus')
  VisitStatus get visitStatus;
  // enum visitStatusEnum {  upcoming,  overdue,  skipped,  completed,  };

  @BuiltValueField(wireName: r'visitedBy')
  User? get visitedBy;

  @BuiltValueField(wireName: r'collector')
  User? get collector;

  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'visitedAt')
  DateTime? get visitedAt;

  @BuiltValueField(wireName: r'visitScheduledAt')
  DateTime get visitScheduledAt;

  @BuiltValueField(wireName: r'comment')
  String? get comment;

  @BuiltValueField(wireName: r'isCompleted')
  bool get isCompleted;

  @BuiltValueField(wireName: r'rescheduledFrom')
  DateTime? get rescheduledFrom;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  Visit._();

  factory Visit([void updates(VisitBuilder b)]) = _$Visit;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Visit> get serializer => _$VisitSerializer();
}

class _$VisitSerializer implements PrimitiveSerializer<Visit> {
  @override
  final Iterable<Type> types = const [Visit, _$Visit];

  @override
  final String wireName = r'Visit';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Visit object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.visitStartedAt != null) {
      yield r'visitStartedAt';
      yield serializers.serialize(
        object.visitStartedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    yield r'visitStatus';
    yield serializers.serialize(
      object.visitStatus,
      specifiedType: const FullType(VisitStatus),
    );
    if (object.visitedBy != null) {
      yield r'visitedBy';
      yield serializers.serialize(
        object.visitedBy,
        specifiedType: const FullType(User),
      );
    }
    if (object.collector != null) {
      yield r'collector';
      yield serializers.serialize(
        object.collector,
        specifiedType: const FullType(User),
      );
    }
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    if (object.visitedAt != null) {
      yield r'visitedAt';
      yield serializers.serialize(
        object.visitedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    yield r'visitScheduledAt';
    yield serializers.serialize(
      object.visitScheduledAt,
      specifiedType: const FullType(DateTime),
    );
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType(String),
      );
    }
    yield r'isCompleted';
    yield serializers.serialize(
      object.isCompleted,
      specifiedType: const FullType(bool),
    );
    if (object.rescheduledFrom != null) {
      yield r'rescheduledFrom';
      yield serializers.serialize(
        object.rescheduledFrom,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'updatedAt';
    yield serializers.serialize(
      object.updatedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    Visit object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'visitStartedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.visitStartedAt = valueDes;
          break;
        case r'visitStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(VisitStatus),
          ) as VisitStatus;
          result.visitStatus = valueDes;
          break;
        case r'visitedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.visitedBy.replace(valueDes);
          break;
        case r'collector':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.collector.replace(valueDes);
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'visitedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.visitedAt = valueDes;
          break;
        case r'visitScheduledAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.visitScheduledAt = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'isCompleted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.isCompleted = valueDes;
          break;
        case r'rescheduledFrom':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.rescheduledFrom = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'updatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Visit deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitBuilder();
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


