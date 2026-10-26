//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/visit_sample_data.dart';
import 'package:es_client/src/model/suspected_positives_data.dart';
import 'package:es_client/src/model/visit_status.dart';
import 'package:es_client/src/model/visit_site_data.dart';
import 'package:es_client/src/model/user.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'visit_response_data.g.dart';

/// VisitResponseData
///
/// Properties:
/// * [visitStartedAt] - Timestamp when the collector opened the page
/// * [visitStatus] 
/// * [round] - Sequential round number of this visit for its site (Nth visit, ordered by schedule date)
/// * [suspectedPositives] 
/// * [site] 
/// * [samples] 
/// * [collector] 
/// * [visitedBy] 
/// * [id] 
/// * [visitedAt] 
/// * [visitScheduledAt] 
/// * [comment] 
/// * [isCompleted] 
/// * [rescheduledFrom] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class VisitResponseData implements Built<VisitResponseData, VisitResponseDataBuilder> {
  /// Timestamp when the collector opened the page
  @BuiltValueField(wireName: r'visitStartedAt')
  DateTime? get visitStartedAt;

  @BuiltValueField(wireName: r'visitStatus')
  VisitStatus get visitStatus;
  // enum visitStatusEnum {  upcoming,  overdue,  skipped,  completed,  };

  /// Sequential round number of this visit for its site (Nth visit, ordered by schedule date)
  @BuiltValueField(wireName: r'round')
  num? get round;

  @BuiltValueField(wireName: r'suspectedPositives')
  BuiltList<SuspectedPositivesData>? get suspectedPositives;

  @BuiltValueField(wireName: r'site')
  VisitSiteData get site;

  @BuiltValueField(wireName: r'samples')
  BuiltList<VisitSampleData> get samples;

  @BuiltValueField(wireName: r'collector')
  User? get collector;

  @BuiltValueField(wireName: r'visitedBy')
  User? get visitedBy;

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

  VisitResponseData._();

  factory VisitResponseData([void updates(VisitResponseDataBuilder b)]) = _$VisitResponseData;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(VisitResponseDataBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<VisitResponseData> get serializer => _$VisitResponseDataSerializer();
}

class _$VisitResponseDataSerializer implements PrimitiveSerializer<VisitResponseData> {
  @override
  final Iterable<Type> types = const [VisitResponseData, _$VisitResponseData];

  @override
  final String wireName = r'VisitResponseData';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    VisitResponseData object, {
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
    if (object.round != null) {
      yield r'round';
      yield serializers.serialize(
        object.round,
        specifiedType: const FullType(num),
      );
    }
    if (object.suspectedPositives != null) {
      yield r'suspectedPositives';
      yield serializers.serialize(
        object.suspectedPositives,
        specifiedType: const FullType(BuiltList, [FullType(SuspectedPositivesData)]),
      );
    }
    yield r'site';
    yield serializers.serialize(
      object.site,
      specifiedType: const FullType(VisitSiteData),
    );
    yield r'samples';
    yield serializers.serialize(
      object.samples,
      specifiedType: const FullType(BuiltList, [FullType(VisitSampleData)]),
    );
    if (object.collector != null) {
      yield r'collector';
      yield serializers.serialize(
        object.collector,
        specifiedType: const FullType(User),
      );
    }
    if (object.visitedBy != null) {
      yield r'visitedBy';
      yield serializers.serialize(
        object.visitedBy,
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
    VisitResponseData object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required VisitResponseDataBuilder result,
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
        case r'round':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.round = valueDes;
          break;
        case r'suspectedPositives':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(SuspectedPositivesData)]),
          ) as BuiltList<SuspectedPositivesData>?;
          if (valueDes == null) continue;
          result.suspectedPositives.replace(valueDes);
          break;
        case r'site':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(VisitSiteData),
          ) as VisitSiteData;
          result.site.replace(valueDes);
          break;
        case r'samples':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(VisitSampleData)]),
          ) as BuiltList<VisitSampleData>;
          result.samples.replace(valueDes);
          break;
        case r'collector':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.collector.replace(valueDes);
          break;
        case r'visitedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(User),
          ) as User?;
          if (valueDes == null) continue;
          result.visitedBy.replace(valueDes);
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
  VisitResponseData deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = VisitResponseDataBuilder();
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


