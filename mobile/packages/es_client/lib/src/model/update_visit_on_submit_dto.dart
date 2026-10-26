//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:es_client/src/model/visit_status.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_visit_on_submit_dto.g.dart';

/// UpdateVisitOnSubmitDto
///
/// Properties:
/// * [visitStartedAt] - Timestamp when the collector opened the page
/// * [visitStatus] 
/// * [siteId] - site id
/// * [projectId] - project id
/// * [teamId] - team id
/// * [visitedBy] - team member id
/// * [photos] - file path
/// * [comment] - comment
/// * [suspectDiseaseData] - This data is updating result of test result for disease
/// * [diseaseQuestionnaireData] - Disease questionnaire responses grouped by disease shortName
/// * [latitude] - Latitude of location where visit was completed
/// * [longitude] - Longitude of location where visit was completed
/// * [visitedAt] 
/// * [isCompleted] 
@BuiltValue()
abstract class UpdateVisitOnSubmitDto implements Built<UpdateVisitOnSubmitDto, UpdateVisitOnSubmitDtoBuilder> {
  /// Timestamp when the collector opened the page
  @BuiltValueField(wireName: r'visitStartedAt')
  DateTime? get visitStartedAt;

  @BuiltValueField(wireName: r'visitStatus')
  VisitStatus get visitStatus;
  // enum visitStatusEnum {  upcoming,  overdue,  skipped,  completed,  };

  /// site id
  @BuiltValueField(wireName: r'siteId')
  String? get siteId;

  /// project id
  @BuiltValueField(wireName: r'projectId')
  String? get projectId;

  /// team id
  @BuiltValueField(wireName: r'teamId')
  String? get teamId;

  /// team member id
  @BuiltValueField(wireName: r'visitedBy')
  String? get visitedBy;

  /// file path
  @BuiltValueField(wireName: r'photos')
  BuiltList<String>? get photos;

  /// comment
  @BuiltValueField(wireName: r'comment')
  String? get comment;

  /// This data is updating result of test result for disease
  @BuiltValueField(wireName: r'suspectDiseaseData')
  BuiltList<String>? get suspectDiseaseData;

  /// Disease questionnaire responses grouped by disease shortName
  @BuiltValueField(wireName: r'diseaseQuestionnaireData')
  JsonObject? get diseaseQuestionnaireData;

  /// Latitude of location where visit was completed
  @BuiltValueField(wireName: r'latitude')
  num? get latitude;

  /// Longitude of location where visit was completed
  @BuiltValueField(wireName: r'longitude')
  num? get longitude;

  @BuiltValueField(wireName: r'visitedAt')
  DateTime? get visitedAt;

  @BuiltValueField(wireName: r'isCompleted')
  bool get isCompleted;

  UpdateVisitOnSubmitDto._();

  factory UpdateVisitOnSubmitDto([void updates(UpdateVisitOnSubmitDtoBuilder b)]) = _$UpdateVisitOnSubmitDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateVisitOnSubmitDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateVisitOnSubmitDto> get serializer => _$UpdateVisitOnSubmitDtoSerializer();
}

class _$UpdateVisitOnSubmitDtoSerializer implements PrimitiveSerializer<UpdateVisitOnSubmitDto> {
  @override
  final Iterable<Type> types = const [UpdateVisitOnSubmitDto, _$UpdateVisitOnSubmitDto];

  @override
  final String wireName = r'UpdateVisitOnSubmitDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateVisitOnSubmitDto object, {
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
    if (object.siteId != null) {
      yield r'siteId';
      yield serializers.serialize(
        object.siteId,
        specifiedType: const FullType(String),
      );
    }
    if (object.projectId != null) {
      yield r'projectId';
      yield serializers.serialize(
        object.projectId,
        specifiedType: const FullType(String),
      );
    }
    if (object.teamId != null) {
      yield r'teamId';
      yield serializers.serialize(
        object.teamId,
        specifiedType: const FullType(String),
      );
    }
    if (object.visitedBy != null) {
      yield r'visitedBy';
      yield serializers.serialize(
        object.visitedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.photos != null) {
      yield r'photos';
      yield serializers.serialize(
        object.photos,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType(String),
      );
    }
    if (object.suspectDiseaseData != null) {
      yield r'suspectDiseaseData';
      yield serializers.serialize(
        object.suspectDiseaseData,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.diseaseQuestionnaireData != null) {
      yield r'diseaseQuestionnaireData';
      yield serializers.serialize(
        object.diseaseQuestionnaireData,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.latitude != null) {
      yield r'latitude';
      yield serializers.serialize(
        object.latitude,
        specifiedType: const FullType(num),
      );
    }
    if (object.longitude != null) {
      yield r'longitude';
      yield serializers.serialize(
        object.longitude,
        specifiedType: const FullType(num),
      );
    }
    if (object.visitedAt != null) {
      yield r'visitedAt';
      yield serializers.serialize(
        object.visitedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    yield r'isCompleted';
    yield serializers.serialize(
      object.isCompleted,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateVisitOnSubmitDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateVisitOnSubmitDtoBuilder result,
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
        case r'siteId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.siteId = valueDes;
          break;
        case r'projectId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.projectId = valueDes;
          break;
        case r'teamId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.teamId = valueDes;
          break;
        case r'visitedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.visitedBy = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.photos.replace(valueDes);
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'suspectDiseaseData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.suspectDiseaseData.replace(valueDes);
          break;
        case r'diseaseQuestionnaireData':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.diseaseQuestionnaireData = valueDes;
          break;
        case r'latitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.latitude = valueDes;
          break;
        case r'longitude':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.longitude = valueDes;
          break;
        case r'visitedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.visitedAt = valueDes;
          break;
        case r'isCompleted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.isCompleted = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateVisitOnSubmitDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateVisitOnSubmitDtoBuilder();
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


