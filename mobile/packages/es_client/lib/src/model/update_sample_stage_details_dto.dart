//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_sample_stage_details_dto.g.dart';

/// UpdateSampleStageDetailsDto
///
/// Properties:
/// * [barcode] 
/// * [collectedBy] 
/// * [collectionTime] 
/// * [receivedAt] 
/// * [receivedBy] 
/// * [receivedVolumeValue] 
/// * [receivedVolumeUnit] 
/// * [receivedStorageTemperature] 
/// * [receivedLabStorageDetails] 
/// * [referenceBatchId] 
/// * [batchReferenceDocument] 
/// * [accessionId] 
/// * [preprocessingDate] 
/// * [preprocessingPerformedBy] 
/// * [preprocessingSteps] 
/// * [extractionDateTime] 
/// * [extractedBy] 
/// * [extractionSampleUsedValue] 
/// * [extractionSampleUsedUnit] 
/// * [extractionSampleRemainingValue] 
/// * [extractionSampleRemainingUnit] 
/// * [extractionComments] 
/// * [testedAt] 
/// * [testedBy] 
/// * [reportGeneratedAt] 
/// * [reportGeneratedBy] 
/// * [details] 
/// * [labTests] 
@BuiltValue()
abstract class UpdateSampleStageDetailsDto implements Built<UpdateSampleStageDetailsDto, UpdateSampleStageDetailsDtoBuilder> {
  @BuiltValueField(wireName: r'barcode')
  String? get barcode;

  @BuiltValueField(wireName: r'collectedBy')
  String? get collectedBy;

  @BuiltValueField(wireName: r'collectionTime')
  String? get collectionTime;

  @BuiltValueField(wireName: r'receivedAt')
  String? get receivedAt;

  @BuiltValueField(wireName: r'receivedBy')
  String? get receivedBy;

  @BuiltValueField(wireName: r'receivedVolumeValue')
  String? get receivedVolumeValue;

  @BuiltValueField(wireName: r'receivedVolumeUnit')
  String? get receivedVolumeUnit;

  @BuiltValueField(wireName: r'receivedStorageTemperature')
  String? get receivedStorageTemperature;

  @BuiltValueField(wireName: r'receivedLabStorageDetails')
  String? get receivedLabStorageDetails;

  @BuiltValueField(wireName: r'referenceBatchId')
  String? get referenceBatchId;

  @BuiltValueField(wireName: r'batchReferenceDocument')
  String? get batchReferenceDocument;

  @BuiltValueField(wireName: r'accessionId')
  String? get accessionId;

  @BuiltValueField(wireName: r'preprocessingDate')
  String? get preprocessingDate;

  @BuiltValueField(wireName: r'preprocessingPerformedBy')
  String? get preprocessingPerformedBy;

  @BuiltValueField(wireName: r'preprocessingSteps')
  BuiltList<JsonObject>? get preprocessingSteps;

  @BuiltValueField(wireName: r'extractionDateTime')
  String? get extractionDateTime;

  @BuiltValueField(wireName: r'extractedBy')
  String? get extractedBy;

  @BuiltValueField(wireName: r'extractionSampleUsedValue')
  String? get extractionSampleUsedValue;

  @BuiltValueField(wireName: r'extractionSampleUsedUnit')
  String? get extractionSampleUsedUnit;

  @BuiltValueField(wireName: r'extractionSampleRemainingValue')
  String? get extractionSampleRemainingValue;

  @BuiltValueField(wireName: r'extractionSampleRemainingUnit')
  String? get extractionSampleRemainingUnit;

  @BuiltValueField(wireName: r'extractionComments')
  String? get extractionComments;

  @BuiltValueField(wireName: r'testedAt')
  String? get testedAt;

  @BuiltValueField(wireName: r'testedBy')
  String? get testedBy;

  @BuiltValueField(wireName: r'reportGeneratedAt')
  String? get reportGeneratedAt;

  @BuiltValueField(wireName: r'reportGeneratedBy')
  String? get reportGeneratedBy;

  @BuiltValueField(wireName: r'details')
  JsonObject? get details;

  @BuiltValueField(wireName: r'labTests')
  BuiltList<JsonObject>? get labTests;

  UpdateSampleStageDetailsDto._();

  factory UpdateSampleStageDetailsDto([void updates(UpdateSampleStageDetailsDtoBuilder b)]) = _$UpdateSampleStageDetailsDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateSampleStageDetailsDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateSampleStageDetailsDto> get serializer => _$UpdateSampleStageDetailsDtoSerializer();
}

class _$UpdateSampleStageDetailsDtoSerializer implements PrimitiveSerializer<UpdateSampleStageDetailsDto> {
  @override
  final Iterable<Type> types = const [UpdateSampleStageDetailsDto, _$UpdateSampleStageDetailsDto];

  @override
  final String wireName = r'UpdateSampleStageDetailsDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateSampleStageDetailsDto object, {
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
    if (object.receivedAt != null) {
      yield r'receivedAt';
      yield serializers.serialize(
        object.receivedAt,
        specifiedType: const FullType(String),
      );
    }
    if (object.receivedBy != null) {
      yield r'receivedBy';
      yield serializers.serialize(
        object.receivedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.receivedVolumeValue != null) {
      yield r'receivedVolumeValue';
      yield serializers.serialize(
        object.receivedVolumeValue,
        specifiedType: const FullType(String),
      );
    }
    if (object.receivedVolumeUnit != null) {
      yield r'receivedVolumeUnit';
      yield serializers.serialize(
        object.receivedVolumeUnit,
        specifiedType: const FullType(String),
      );
    }
    if (object.receivedStorageTemperature != null) {
      yield r'receivedStorageTemperature';
      yield serializers.serialize(
        object.receivedStorageTemperature,
        specifiedType: const FullType(String),
      );
    }
    if (object.receivedLabStorageDetails != null) {
      yield r'receivedLabStorageDetails';
      yield serializers.serialize(
        object.receivedLabStorageDetails,
        specifiedType: const FullType(String),
      );
    }
    if (object.referenceBatchId != null) {
      yield r'referenceBatchId';
      yield serializers.serialize(
        object.referenceBatchId,
        specifiedType: const FullType(String),
      );
    }
    if (object.batchReferenceDocument != null) {
      yield r'batchReferenceDocument';
      yield serializers.serialize(
        object.batchReferenceDocument,
        specifiedType: const FullType(String),
      );
    }
    if (object.accessionId != null) {
      yield r'accessionId';
      yield serializers.serialize(
        object.accessionId,
        specifiedType: const FullType(String),
      );
    }
    if (object.preprocessingDate != null) {
      yield r'preprocessingDate';
      yield serializers.serialize(
        object.preprocessingDate,
        specifiedType: const FullType(String),
      );
    }
    if (object.preprocessingPerformedBy != null) {
      yield r'preprocessingPerformedBy';
      yield serializers.serialize(
        object.preprocessingPerformedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.preprocessingSteps != null) {
      yield r'preprocessingSteps';
      yield serializers.serialize(
        object.preprocessingSteps,
        specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
      );
    }
    if (object.extractionDateTime != null) {
      yield r'extractionDateTime';
      yield serializers.serialize(
        object.extractionDateTime,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractedBy != null) {
      yield r'extractedBy';
      yield serializers.serialize(
        object.extractedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractionSampleUsedValue != null) {
      yield r'extractionSampleUsedValue';
      yield serializers.serialize(
        object.extractionSampleUsedValue,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractionSampleUsedUnit != null) {
      yield r'extractionSampleUsedUnit';
      yield serializers.serialize(
        object.extractionSampleUsedUnit,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractionSampleRemainingValue != null) {
      yield r'extractionSampleRemainingValue';
      yield serializers.serialize(
        object.extractionSampleRemainingValue,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractionSampleRemainingUnit != null) {
      yield r'extractionSampleRemainingUnit';
      yield serializers.serialize(
        object.extractionSampleRemainingUnit,
        specifiedType: const FullType(String),
      );
    }
    if (object.extractionComments != null) {
      yield r'extractionComments';
      yield serializers.serialize(
        object.extractionComments,
        specifiedType: const FullType(String),
      );
    }
    if (object.testedAt != null) {
      yield r'testedAt';
      yield serializers.serialize(
        object.testedAt,
        specifiedType: const FullType(String),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.reportGeneratedAt != null) {
      yield r'reportGeneratedAt';
      yield serializers.serialize(
        object.reportGeneratedAt,
        specifiedType: const FullType(String),
      );
    }
    if (object.reportGeneratedBy != null) {
      yield r'reportGeneratedBy';
      yield serializers.serialize(
        object.reportGeneratedBy,
        specifiedType: const FullType(String),
      );
    }
    if (object.details != null) {
      yield r'details';
      yield serializers.serialize(
        object.details,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.labTests != null) {
      yield r'labTests';
      yield serializers.serialize(
        object.labTests,
        specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateSampleStageDetailsDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateSampleStageDetailsDtoBuilder result,
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
        case r'receivedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedAt = valueDes;
          break;
        case r'receivedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedBy = valueDes;
          break;
        case r'receivedVolumeValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedVolumeValue = valueDes;
          break;
        case r'receivedVolumeUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedVolumeUnit = valueDes;
          break;
        case r'receivedStorageTemperature':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedStorageTemperature = valueDes;
          break;
        case r'receivedLabStorageDetails':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.receivedLabStorageDetails = valueDes;
          break;
        case r'referenceBatchId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.referenceBatchId = valueDes;
          break;
        case r'batchReferenceDocument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.batchReferenceDocument = valueDes;
          break;
        case r'accessionId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.accessionId = valueDes;
          break;
        case r'preprocessingDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.preprocessingDate = valueDes;
          break;
        case r'preprocessingPerformedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.preprocessingPerformedBy = valueDes;
          break;
        case r'preprocessingSteps':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>?;
          if (valueDes == null) continue;
          result.preprocessingSteps.replace(valueDes);
          break;
        case r'extractionDateTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionDateTime = valueDes;
          break;
        case r'extractedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractedBy = valueDes;
          break;
        case r'extractionSampleUsedValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleUsedValue = valueDes;
          break;
        case r'extractionSampleUsedUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleUsedUnit = valueDes;
          break;
        case r'extractionSampleRemainingValue':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleRemainingValue = valueDes;
          break;
        case r'extractionSampleRemainingUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionSampleRemainingUnit = valueDes;
          break;
        case r'extractionComments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.extractionComments = valueDes;
          break;
        case r'testedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.testedAt = valueDes;
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.testedBy = valueDes;
          break;
        case r'reportGeneratedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.reportGeneratedAt = valueDes;
          break;
        case r'reportGeneratedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.reportGeneratedBy = valueDes;
          break;
        case r'details':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.details = valueDes;
          break;
        case r'labTests':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>?;
          if (valueDes == null) continue;
          result.labTests.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateSampleStageDetailsDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateSampleStageDetailsDtoBuilder();
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


