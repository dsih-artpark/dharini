//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_sample_dto.g.dart';

/// CreateSampleDto
///
/// Properties:
/// * [quantity] - Quantity
/// * [replicates] - Replicates
/// * [unit] - Unit
/// * [photos] - File path
/// * [barcode] - Barcode
/// * [originalSampleBarcode] - Barcode of original sample if exist
/// * [site] - Site UUID
/// * [team] - Team UUID
/// * [diseases] - Disease ID array
/// * [testDate] - When the sample is tested
/// * [collectedBy] - Who collected the sample
/// * [receivedBy] - Who received the sample
/// * [extractedBy] - Who extracted the sample
/// * [testedBy] - Who tested the sample
/// * [reportGeneratedBy] - Who generated the sample report
/// * [latitude] - latitude
/// * [longitude] - longitude
/// * [sampleStatus] - Sample status enum [picked-up, received, extracted, tested, rejected, test-report-generated]
/// * [comment] - Comments
/// * [visit] - Visit UUID
/// * [sampleType] - Sample type UUID
/// * [species] - Species UUID
/// * [rejectReason] - Reason for rejection
/// * [receivedAt] - Timestamp when the sample was received
/// * [receivedVolumeValue] - Received volume value
/// * [receivedVolumeUnit] - Received volume unit
/// * [receivedLabStorageDetails] - Received lab storage details
/// * [referenceBatchId] - Reference batch ID
/// * [batchReferenceDocument] - Batch reference document (URL or filename)
/// * [accessionId] - Accession ID
/// * [extractionDateTime] - Timestamp when extraction was performed
/// * [extractionSampleUsedValue] - Sample used value for extraction
/// * [extractionSampleUsedUnit] - Sample used unit for extraction
/// * [extractionSampleRemainingValue] - Remaining sample value after extraction
/// * [extractionSampleRemainingUnit] - Remaining sample unit after extraction
/// * [extractionComments] - Comments related to the extraction process
/// * [preprocessingSteps] - Pre-processing steps data
/// * [preprocessingDate] - Pre-processing date
/// * [preprocessingStorageTemperature] - Pre-processing storage temperature
/// * [preprocessingStorageDetails] - Pre-processing storage details
/// * [preprocessingPerformedBy] - User who performed pre-processing
/// * [pooledSampleIds] - IDs of samples pooled with this sample
/// * [pooledWith] - Samples pooled with this sample (resolved entities)
/// * [isPooledSample] - Whether this is a pooled sample
/// * [details] - Additional dynamic details (e.g. extraction metadata)
@BuiltValue()
abstract class CreateSampleDto implements Built<CreateSampleDto, CreateSampleDtoBuilder> {
  /// Quantity
  @BuiltValueField(wireName: r'quantity')
  num? get quantity;

  /// Replicates
  @BuiltValueField(wireName: r'replicates')
  CreateSampleDtoReplicatesEnum? get replicates;
  // enum replicatesEnum {  available,  not collected,  };

  /// Unit
  @BuiltValueField(wireName: r'unit')
  String? get unit;

  /// File path
  @BuiltValueField(wireName: r'photos')
  BuiltList<String>? get photos;

  /// Barcode
  @BuiltValueField(wireName: r'barcode')
  String get barcode;

  /// Barcode of original sample if exist
  @BuiltValueField(wireName: r'originalSampleBarcode')
  String? get originalSampleBarcode;

  /// Site UUID
  @BuiltValueField(wireName: r'site')
  JsonObject get site;

  /// Team UUID
  @BuiltValueField(wireName: r'team')
  JsonObject get team;

  /// Disease ID array
  @BuiltValueField(wireName: r'diseases')
  BuiltList<JsonObject> get diseases;

  /// When the sample is tested
  @BuiltValueField(wireName: r'testDate')
  DateTime? get testDate;

  /// Who collected the sample
  @BuiltValueField(wireName: r'collectedBy')
  JsonObject? get collectedBy;

  /// Who received the sample
  @BuiltValueField(wireName: r'receivedBy')
  JsonObject? get receivedBy;

  /// Who extracted the sample
  @BuiltValueField(wireName: r'extractedBy')
  JsonObject? get extractedBy;

  /// Who tested the sample
  @BuiltValueField(wireName: r'testedBy')
  JsonObject? get testedBy;

  /// Who generated the sample report
  @BuiltValueField(wireName: r'reportGeneratedBy')
  JsonObject? get reportGeneratedBy;

  /// latitude
  @BuiltValueField(wireName: r'latitude')
  num? get latitude;

  /// longitude
  @BuiltValueField(wireName: r'longitude')
  num? get longitude;

  /// Sample status enum [picked-up, received, extracted, tested, rejected, test-report-generated]
  @BuiltValueField(wireName: r'sampleStatus')
  CreateSampleDtoSampleStatusEnum? get sampleStatus;
  // enum sampleStatusEnum {  pending,  picked-up,  received,  pre-processed,  virus-isolation,  extracted,  tested,  rejected,  test-report-generated,  };

  /// Comments
  @BuiltValueField(wireName: r'comment')
  String? get comment;

  /// Visit UUID
  @BuiltValueField(wireName: r'visit')
  JsonObject get visit;

  /// Sample type UUID
  @BuiltValueField(wireName: r'sampleType')
  JsonObject get sampleType;

  /// Species UUID
  @BuiltValueField(wireName: r'species')
  JsonObject? get species;

  /// Reason for rejection
  @BuiltValueField(wireName: r'rejectReason')
  String? get rejectReason;

  /// Timestamp when the sample was received
  @BuiltValueField(wireName: r'receivedAt')
  DateTime? get receivedAt;

  /// Received volume value
  @BuiltValueField(wireName: r'receivedVolumeValue')
  String? get receivedVolumeValue;

  /// Received volume unit
  @BuiltValueField(wireName: r'receivedVolumeUnit')
  String? get receivedVolumeUnit;

  /// Received lab storage details
  @BuiltValueField(wireName: r'receivedLabStorageDetails')
  String? get receivedLabStorageDetails;

  /// Reference batch ID
  @BuiltValueField(wireName: r'referenceBatchId')
  String? get referenceBatchId;

  /// Batch reference document (URL or filename)
  @BuiltValueField(wireName: r'batchReferenceDocument')
  String? get batchReferenceDocument;

  /// Accession ID
  @BuiltValueField(wireName: r'accessionId')
  String? get accessionId;

  /// Timestamp when extraction was performed
  @BuiltValueField(wireName: r'extractionDateTime')
  DateTime? get extractionDateTime;

  /// Sample used value for extraction
  @BuiltValueField(wireName: r'extractionSampleUsedValue')
  String? get extractionSampleUsedValue;

  /// Sample used unit for extraction
  @BuiltValueField(wireName: r'extractionSampleUsedUnit')
  String? get extractionSampleUsedUnit;

  /// Remaining sample value after extraction
  @BuiltValueField(wireName: r'extractionSampleRemainingValue')
  String? get extractionSampleRemainingValue;

  /// Remaining sample unit after extraction
  @BuiltValueField(wireName: r'extractionSampleRemainingUnit')
  String? get extractionSampleRemainingUnit;

  /// Comments related to the extraction process
  @BuiltValueField(wireName: r'extractionComments')
  String? get extractionComments;

  /// Pre-processing steps data
  @BuiltValueField(wireName: r'preprocessingSteps')
  BuiltList<JsonObject>? get preprocessingSteps;

  /// Pre-processing date
  @BuiltValueField(wireName: r'preprocessingDate')
  DateTime? get preprocessingDate;

  /// Pre-processing storage temperature
  @BuiltValueField(wireName: r'preprocessingStorageTemperature')
  String? get preprocessingStorageTemperature;

  /// Pre-processing storage details
  @BuiltValueField(wireName: r'preprocessingStorageDetails')
  String? get preprocessingStorageDetails;

  /// User who performed pre-processing
  @BuiltValueField(wireName: r'preprocessingPerformedBy')
  JsonObject? get preprocessingPerformedBy;

  /// IDs of samples pooled with this sample
  @BuiltValueField(wireName: r'pooledSampleIds')
  BuiltList<String>? get pooledSampleIds;

  /// Samples pooled with this sample (resolved entities)
  @BuiltValueField(wireName: r'pooledWith')
  BuiltList<JsonObject>? get pooledWith;

  /// Whether this is a pooled sample
  @BuiltValueField(wireName: r'isPooledSample')
  bool? get isPooledSample;

  /// Additional dynamic details (e.g. extraction metadata)
  @BuiltValueField(wireName: r'details')
  JsonObject? get details;

  CreateSampleDto._();

  factory CreateSampleDto([void updates(CreateSampleDtoBuilder b)]) = _$CreateSampleDto;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateSampleDtoBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateSampleDto> get serializer => _$CreateSampleDtoSerializer();
}

class _$CreateSampleDtoSerializer implements PrimitiveSerializer<CreateSampleDto> {
  @override
  final Iterable<Type> types = const [CreateSampleDto, _$CreateSampleDto];

  @override
  final String wireName = r'CreateSampleDto';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateSampleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.quantity != null) {
      yield r'quantity';
      yield serializers.serialize(
        object.quantity,
        specifiedType: const FullType(num),
      );
    }
    if (object.replicates != null) {
      yield r'replicates';
      yield serializers.serialize(
        object.replicates,
        specifiedType: const FullType(CreateSampleDtoReplicatesEnum),
      );
    }
    if (object.unit != null) {
      yield r'unit';
      yield serializers.serialize(
        object.unit,
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
    yield r'barcode';
    yield serializers.serialize(
      object.barcode,
      specifiedType: const FullType(String),
    );
    if (object.originalSampleBarcode != null) {
      yield r'originalSampleBarcode';
      yield serializers.serialize(
        object.originalSampleBarcode,
        specifiedType: const FullType(String),
      );
    }
    yield r'site';
    yield serializers.serialize(
      object.site,
      specifiedType: const FullType(JsonObject),
    );
    yield r'team';
    yield serializers.serialize(
      object.team,
      specifiedType: const FullType(JsonObject),
    );
    yield r'diseases';
    yield serializers.serialize(
      object.diseases,
      specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
    );
    if (object.testDate != null) {
      yield r'testDate';
      yield serializers.serialize(
        object.testDate,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.collectedBy != null) {
      yield r'collectedBy';
      yield serializers.serialize(
        object.collectedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.receivedBy != null) {
      yield r'receivedBy';
      yield serializers.serialize(
        object.receivedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.extractedBy != null) {
      yield r'extractedBy';
      yield serializers.serialize(
        object.extractedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.testedBy != null) {
      yield r'testedBy';
      yield serializers.serialize(
        object.testedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.reportGeneratedBy != null) {
      yield r'reportGeneratedBy';
      yield serializers.serialize(
        object.reportGeneratedBy,
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
    if (object.sampleStatus != null) {
      yield r'sampleStatus';
      yield serializers.serialize(
        object.sampleStatus,
        specifiedType: const FullType(CreateSampleDtoSampleStatusEnum),
      );
    }
    if (object.comment != null) {
      yield r'comment';
      yield serializers.serialize(
        object.comment,
        specifiedType: const FullType(String),
      );
    }
    yield r'visit';
    yield serializers.serialize(
      object.visit,
      specifiedType: const FullType(JsonObject),
    );
    yield r'sampleType';
    yield serializers.serialize(
      object.sampleType,
      specifiedType: const FullType(JsonObject),
    );
    if (object.species != null) {
      yield r'species';
      yield serializers.serialize(
        object.species,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.rejectReason != null) {
      yield r'rejectReason';
      yield serializers.serialize(
        object.rejectReason,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedAt != null) {
      yield r'receivedAt';
      yield serializers.serialize(
        object.receivedAt,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.receivedVolumeValue != null) {
      yield r'receivedVolumeValue';
      yield serializers.serialize(
        object.receivedVolumeValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedVolumeUnit != null) {
      yield r'receivedVolumeUnit';
      yield serializers.serialize(
        object.receivedVolumeUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.receivedLabStorageDetails != null) {
      yield r'receivedLabStorageDetails';
      yield serializers.serialize(
        object.receivedLabStorageDetails,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.referenceBatchId != null) {
      yield r'referenceBatchId';
      yield serializers.serialize(
        object.referenceBatchId,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.batchReferenceDocument != null) {
      yield r'batchReferenceDocument';
      yield serializers.serialize(
        object.batchReferenceDocument,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.accessionId != null) {
      yield r'accessionId';
      yield serializers.serialize(
        object.accessionId,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionDateTime != null) {
      yield r'extractionDateTime';
      yield serializers.serialize(
        object.extractionDateTime,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.extractionSampleUsedValue != null) {
      yield r'extractionSampleUsedValue';
      yield serializers.serialize(
        object.extractionSampleUsedValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleUsedUnit != null) {
      yield r'extractionSampleUsedUnit';
      yield serializers.serialize(
        object.extractionSampleUsedUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleRemainingValue != null) {
      yield r'extractionSampleRemainingValue';
      yield serializers.serialize(
        object.extractionSampleRemainingValue,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionSampleRemainingUnit != null) {
      yield r'extractionSampleRemainingUnit';
      yield serializers.serialize(
        object.extractionSampleRemainingUnit,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.extractionComments != null) {
      yield r'extractionComments';
      yield serializers.serialize(
        object.extractionComments,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.preprocessingSteps != null) {
      yield r'preprocessingSteps';
      yield serializers.serialize(
        object.preprocessingSteps,
        specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
      );
    }
    if (object.preprocessingDate != null) {
      yield r'preprocessingDate';
      yield serializers.serialize(
        object.preprocessingDate,
        specifiedType: const FullType.nullable(DateTime),
      );
    }
    if (object.preprocessingStorageTemperature != null) {
      yield r'preprocessingStorageTemperature';
      yield serializers.serialize(
        object.preprocessingStorageTemperature,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.preprocessingStorageDetails != null) {
      yield r'preprocessingStorageDetails';
      yield serializers.serialize(
        object.preprocessingStorageDetails,
        specifiedType: const FullType.nullable(String),
      );
    }
    if (object.preprocessingPerformedBy != null) {
      yield r'preprocessingPerformedBy';
      yield serializers.serialize(
        object.preprocessingPerformedBy,
        specifiedType: const FullType(JsonObject),
      );
    }
    if (object.pooledSampleIds != null) {
      yield r'pooledSampleIds';
      yield serializers.serialize(
        object.pooledSampleIds,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.pooledWith != null) {
      yield r'pooledWith';
      yield serializers.serialize(
        object.pooledWith,
        specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
      );
    }
    if (object.isPooledSample != null) {
      yield r'isPooledSample';
      yield serializers.serialize(
        object.isPooledSample,
        specifiedType: const FullType(bool),
      );
    }
    if (object.details != null) {
      yield r'details';
      yield serializers.serialize(
        object.details,
        specifiedType: const FullType(JsonObject),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateSampleDto object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateSampleDtoBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'quantity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.quantity = valueDes;
          break;
        case r'replicates':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateSampleDtoReplicatesEnum),
          ) as CreateSampleDtoReplicatesEnum?;
          if (valueDes == null) continue;
          result.replicates = valueDes;
          break;
        case r'unit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.unit = valueDes;
          break;
        case r'photos':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.photos.replace(valueDes);
          break;
        case r'barcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.barcode = valueDes;
          break;
        case r'originalSampleBarcode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.originalSampleBarcode = valueDes;
          break;
        case r'site':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.site = valueDes;
          break;
        case r'team':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.team = valueDes;
          break;
        case r'diseases':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>;
          result.diseases.replace(valueDes);
          break;
        case r'testDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.testDate = valueDes;
          break;
        case r'collectedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.collectedBy = valueDes;
          break;
        case r'receivedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.receivedBy = valueDes;
          break;
        case r'extractedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.extractedBy = valueDes;
          break;
        case r'testedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.testedBy = valueDes;
          break;
        case r'reportGeneratedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.reportGeneratedBy = valueDes;
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
        case r'sampleStatus':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateSampleDtoSampleStatusEnum),
          ) as CreateSampleDtoSampleStatusEnum?;
          if (valueDes == null) continue;
          result.sampleStatus = valueDes;
          break;
        case r'comment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.comment = valueDes;
          break;
        case r'visit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.visit = valueDes;
          break;
        case r'sampleType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JsonObject),
          ) as JsonObject;
          result.sampleType = valueDes;
          break;
        case r'species':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.species = valueDes;
          break;
        case r'rejectReason':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.rejectReason = valueDes;
          break;
        case r'receivedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.receivedAt = valueDes;
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
        case r'extractionDateTime':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.extractionDateTime = valueDes;
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
        case r'preprocessingSteps':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>?;
          if (valueDes == null) continue;
          result.preprocessingSteps.replace(valueDes);
          break;
        case r'preprocessingDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.preprocessingDate = valueDes;
          break;
        case r'preprocessingStorageTemperature':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.preprocessingStorageTemperature = valueDes;
          break;
        case r'preprocessingStorageDetails':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.preprocessingStorageDetails = valueDes;
          break;
        case r'preprocessingPerformedBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.preprocessingPerformedBy = valueDes;
          break;
        case r'pooledSampleIds':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.pooledSampleIds.replace(valueDes);
          break;
        case r'pooledWith':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(JsonObject)]),
          ) as BuiltList<JsonObject>?;
          if (valueDes == null) continue;
          result.pooledWith.replace(valueDes);
          break;
        case r'isPooledSample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.isPooledSample = valueDes;
          break;
        case r'details':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(JsonObject),
          ) as JsonObject?;
          if (valueDes == null) continue;
          result.details = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateSampleDto deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateSampleDtoBuilder();
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


/// Replicates
class CreateSampleDtoReplicatesEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'available')
  static const CreateSampleDtoReplicatesEnum available = _$createSampleDtoReplicatesEnum_available;
  @BuiltValueEnumConst(wireName: r'not collected')
  static const CreateSampleDtoReplicatesEnum notCollected = _$createSampleDtoReplicatesEnum_notCollected;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateSampleDtoReplicatesEnum unknownDefaultOpenApi = _$createSampleDtoReplicatesEnum_unknownDefaultOpenApi;

  static Serializer<CreateSampleDtoReplicatesEnum> get serializer => _$createSampleDtoReplicatesEnumSerializer;

  const CreateSampleDtoReplicatesEnum._(String name): super(name);

  static BuiltSet<CreateSampleDtoReplicatesEnum> get values => _$createSampleDtoReplicatesEnumValues;
  static CreateSampleDtoReplicatesEnum valueOf(String name) => _$createSampleDtoReplicatesEnumValueOf(name);
}

/// Sample status enum [picked-up, received, extracted, tested, rejected, test-report-generated]
class CreateSampleDtoSampleStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pending')
  static const CreateSampleDtoSampleStatusEnum pending = _$createSampleDtoSampleStatusEnum_pending;
  @BuiltValueEnumConst(wireName: r'picked-up')
  static const CreateSampleDtoSampleStatusEnum pickedUp = _$createSampleDtoSampleStatusEnum_pickedUp;
  @BuiltValueEnumConst(wireName: r'received')
  static const CreateSampleDtoSampleStatusEnum received = _$createSampleDtoSampleStatusEnum_received;
  @BuiltValueEnumConst(wireName: r'pre-processed')
  static const CreateSampleDtoSampleStatusEnum preProcessed = _$createSampleDtoSampleStatusEnum_preProcessed;
  @BuiltValueEnumConst(wireName: r'virus-isolation')
  static const CreateSampleDtoSampleStatusEnum virusIsolation = _$createSampleDtoSampleStatusEnum_virusIsolation;
  @BuiltValueEnumConst(wireName: r'extracted')
  static const CreateSampleDtoSampleStatusEnum extracted = _$createSampleDtoSampleStatusEnum_extracted;
  @BuiltValueEnumConst(wireName: r'tested')
  static const CreateSampleDtoSampleStatusEnum tested = _$createSampleDtoSampleStatusEnum_tested;
  @BuiltValueEnumConst(wireName: r'rejected')
  static const CreateSampleDtoSampleStatusEnum rejected = _$createSampleDtoSampleStatusEnum_rejected;
  @BuiltValueEnumConst(wireName: r'test-report-generated')
  static const CreateSampleDtoSampleStatusEnum testReportGenerated = _$createSampleDtoSampleStatusEnum_testReportGenerated;
  @BuiltValueEnumConst(wireName: r'unknown_default_open_api', fallback: true)
  static const CreateSampleDtoSampleStatusEnum unknownDefaultOpenApi = _$createSampleDtoSampleStatusEnum_unknownDefaultOpenApi;

  static Serializer<CreateSampleDtoSampleStatusEnum> get serializer => _$createSampleDtoSampleStatusEnumSerializer;

  const CreateSampleDtoSampleStatusEnum._(String name): super(name);

  static BuiltSet<CreateSampleDtoSampleStatusEnum> get values => _$createSampleDtoSampleStatusEnumValues;
  static CreateSampleDtoSampleStatusEnum valueOf(String name) => _$createSampleDtoSampleStatusEnumValueOf(name);
}

