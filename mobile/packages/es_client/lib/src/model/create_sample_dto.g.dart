// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_sample_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateSampleDtoReplicatesEnum _$createSampleDtoReplicatesEnum_available =
    const CreateSampleDtoReplicatesEnum._('available');
const CreateSampleDtoReplicatesEnum
    _$createSampleDtoReplicatesEnum_notCollected =
    const CreateSampleDtoReplicatesEnum._('notCollected');
const CreateSampleDtoReplicatesEnum
    _$createSampleDtoReplicatesEnum_unknownDefaultOpenApi =
    const CreateSampleDtoReplicatesEnum._('unknownDefaultOpenApi');

CreateSampleDtoReplicatesEnum _$createSampleDtoReplicatesEnumValueOf(
    String name) {
  switch (name) {
    case 'available':
      return _$createSampleDtoReplicatesEnum_available;
    case 'notCollected':
      return _$createSampleDtoReplicatesEnum_notCollected;
    case 'unknownDefaultOpenApi':
      return _$createSampleDtoReplicatesEnum_unknownDefaultOpenApi;
    default:
      return _$createSampleDtoReplicatesEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateSampleDtoReplicatesEnum>
    _$createSampleDtoReplicatesEnumValues = BuiltSet<
        CreateSampleDtoReplicatesEnum>(const <CreateSampleDtoReplicatesEnum>[
  _$createSampleDtoReplicatesEnum_available,
  _$createSampleDtoReplicatesEnum_notCollected,
  _$createSampleDtoReplicatesEnum_unknownDefaultOpenApi,
]);

const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_pending =
    const CreateSampleDtoSampleStatusEnum._('pending');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_pickedUp =
    const CreateSampleDtoSampleStatusEnum._('pickedUp');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_received =
    const CreateSampleDtoSampleStatusEnum._('received');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_preProcessed =
    const CreateSampleDtoSampleStatusEnum._('preProcessed');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_virusIsolation =
    const CreateSampleDtoSampleStatusEnum._('virusIsolation');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_extracted =
    const CreateSampleDtoSampleStatusEnum._('extracted');
const CreateSampleDtoSampleStatusEnum _$createSampleDtoSampleStatusEnum_tested =
    const CreateSampleDtoSampleStatusEnum._('tested');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_rejected =
    const CreateSampleDtoSampleStatusEnum._('rejected');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_testReportGenerated =
    const CreateSampleDtoSampleStatusEnum._('testReportGenerated');
const CreateSampleDtoSampleStatusEnum
    _$createSampleDtoSampleStatusEnum_unknownDefaultOpenApi =
    const CreateSampleDtoSampleStatusEnum._('unknownDefaultOpenApi');

CreateSampleDtoSampleStatusEnum _$createSampleDtoSampleStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'pending':
      return _$createSampleDtoSampleStatusEnum_pending;
    case 'pickedUp':
      return _$createSampleDtoSampleStatusEnum_pickedUp;
    case 'received':
      return _$createSampleDtoSampleStatusEnum_received;
    case 'preProcessed':
      return _$createSampleDtoSampleStatusEnum_preProcessed;
    case 'virusIsolation':
      return _$createSampleDtoSampleStatusEnum_virusIsolation;
    case 'extracted':
      return _$createSampleDtoSampleStatusEnum_extracted;
    case 'tested':
      return _$createSampleDtoSampleStatusEnum_tested;
    case 'rejected':
      return _$createSampleDtoSampleStatusEnum_rejected;
    case 'testReportGenerated':
      return _$createSampleDtoSampleStatusEnum_testReportGenerated;
    case 'unknownDefaultOpenApi':
      return _$createSampleDtoSampleStatusEnum_unknownDefaultOpenApi;
    default:
      return _$createSampleDtoSampleStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateSampleDtoSampleStatusEnum>
    _$createSampleDtoSampleStatusEnumValues = BuiltSet<
        CreateSampleDtoSampleStatusEnum>(const <CreateSampleDtoSampleStatusEnum>[
  _$createSampleDtoSampleStatusEnum_pending,
  _$createSampleDtoSampleStatusEnum_pickedUp,
  _$createSampleDtoSampleStatusEnum_received,
  _$createSampleDtoSampleStatusEnum_preProcessed,
  _$createSampleDtoSampleStatusEnum_virusIsolation,
  _$createSampleDtoSampleStatusEnum_extracted,
  _$createSampleDtoSampleStatusEnum_tested,
  _$createSampleDtoSampleStatusEnum_rejected,
  _$createSampleDtoSampleStatusEnum_testReportGenerated,
  _$createSampleDtoSampleStatusEnum_unknownDefaultOpenApi,
]);

Serializer<CreateSampleDtoReplicatesEnum>
    _$createSampleDtoReplicatesEnumSerializer =
    _$CreateSampleDtoReplicatesEnumSerializer();
Serializer<CreateSampleDtoSampleStatusEnum>
    _$createSampleDtoSampleStatusEnumSerializer =
    _$CreateSampleDtoSampleStatusEnumSerializer();

class _$CreateSampleDtoReplicatesEnumSerializer
    implements PrimitiveSerializer<CreateSampleDtoReplicatesEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'available': 'available',
    'notCollected': 'not collected',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'available': 'available',
    'not collected': 'notCollected',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateSampleDtoReplicatesEnum];
  @override
  final String wireName = 'CreateSampleDtoReplicatesEnum';

  @override
  Object serialize(
          Serializers serializers, CreateSampleDtoReplicatesEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateSampleDtoReplicatesEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateSampleDtoReplicatesEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateSampleDtoSampleStatusEnumSerializer
    implements PrimitiveSerializer<CreateSampleDtoSampleStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'pickedUp': 'picked-up',
    'received': 'received',
    'preProcessed': 'pre-processed',
    'virusIsolation': 'virus-isolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'testReportGenerated': 'test-report-generated',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'picked-up': 'pickedUp',
    'received': 'received',
    'pre-processed': 'preProcessed',
    'virus-isolation': 'virusIsolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'test-report-generated': 'testReportGenerated',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateSampleDtoSampleStatusEnum];
  @override
  final String wireName = 'CreateSampleDtoSampleStatusEnum';

  @override
  Object serialize(
          Serializers serializers, CreateSampleDtoSampleStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateSampleDtoSampleStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateSampleDtoSampleStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateSampleDto extends CreateSampleDto {
  @override
  final num? quantity;
  @override
  final CreateSampleDtoReplicatesEnum? replicates;
  @override
  final String? unit;
  @override
  final BuiltList<String>? photos;
  @override
  final String barcode;
  @override
  final String? originalSampleBarcode;
  @override
  final JsonObject site;
  @override
  final JsonObject team;
  @override
  final BuiltList<JsonObject> diseases;
  @override
  final DateTime? testDate;
  @override
  final JsonObject? collectedBy;
  @override
  final JsonObject? receivedBy;
  @override
  final JsonObject? extractedBy;
  @override
  final JsonObject? testedBy;
  @override
  final JsonObject? reportGeneratedBy;
  @override
  final num? latitude;
  @override
  final num? longitude;
  @override
  final CreateSampleDtoSampleStatusEnum? sampleStatus;
  @override
  final String? comment;
  @override
  final JsonObject visit;
  @override
  final JsonObject sampleType;
  @override
  final JsonObject? species;
  @override
  final String? rejectReason;
  @override
  final DateTime? receivedAt;
  @override
  final String? receivedVolumeValue;
  @override
  final String? receivedVolumeUnit;
  @override
  final String? receivedLabStorageDetails;
  @override
  final String? referenceBatchId;
  @override
  final String? batchReferenceDocument;
  @override
  final String? accessionId;
  @override
  final DateTime? extractionDateTime;
  @override
  final String? extractionSampleUsedValue;
  @override
  final String? extractionSampleUsedUnit;
  @override
  final String? extractionSampleRemainingValue;
  @override
  final String? extractionSampleRemainingUnit;
  @override
  final String? extractionComments;
  @override
  final BuiltList<JsonObject>? preprocessingSteps;
  @override
  final DateTime? preprocessingDate;
  @override
  final String? preprocessingStorageTemperature;
  @override
  final String? preprocessingStorageDetails;
  @override
  final JsonObject? preprocessingPerformedBy;
  @override
  final BuiltList<String>? pooledSampleIds;
  @override
  final BuiltList<JsonObject>? pooledWith;
  @override
  final bool? isPooledSample;
  @override
  final JsonObject? details;

  factory _$CreateSampleDto([void Function(CreateSampleDtoBuilder)? updates]) =>
      (CreateSampleDtoBuilder()..update(updates))._build();

  _$CreateSampleDto._(
      {this.quantity,
      this.replicates,
      this.unit,
      this.photos,
      required this.barcode,
      this.originalSampleBarcode,
      required this.site,
      required this.team,
      required this.diseases,
      this.testDate,
      this.collectedBy,
      this.receivedBy,
      this.extractedBy,
      this.testedBy,
      this.reportGeneratedBy,
      this.latitude,
      this.longitude,
      this.sampleStatus,
      this.comment,
      required this.visit,
      required this.sampleType,
      this.species,
      this.rejectReason,
      this.receivedAt,
      this.receivedVolumeValue,
      this.receivedVolumeUnit,
      this.receivedLabStorageDetails,
      this.referenceBatchId,
      this.batchReferenceDocument,
      this.accessionId,
      this.extractionDateTime,
      this.extractionSampleUsedValue,
      this.extractionSampleUsedUnit,
      this.extractionSampleRemainingValue,
      this.extractionSampleRemainingUnit,
      this.extractionComments,
      this.preprocessingSteps,
      this.preprocessingDate,
      this.preprocessingStorageTemperature,
      this.preprocessingStorageDetails,
      this.preprocessingPerformedBy,
      this.pooledSampleIds,
      this.pooledWith,
      this.isPooledSample,
      this.details})
      : super._();
  @override
  CreateSampleDto rebuild(void Function(CreateSampleDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateSampleDtoBuilder toBuilder() => CreateSampleDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateSampleDto &&
        quantity == other.quantity &&
        replicates == other.replicates &&
        unit == other.unit &&
        photos == other.photos &&
        barcode == other.barcode &&
        originalSampleBarcode == other.originalSampleBarcode &&
        site == other.site &&
        team == other.team &&
        diseases == other.diseases &&
        testDate == other.testDate &&
        collectedBy == other.collectedBy &&
        receivedBy == other.receivedBy &&
        extractedBy == other.extractedBy &&
        testedBy == other.testedBy &&
        reportGeneratedBy == other.reportGeneratedBy &&
        latitude == other.latitude &&
        longitude == other.longitude &&
        sampleStatus == other.sampleStatus &&
        comment == other.comment &&
        visit == other.visit &&
        sampleType == other.sampleType &&
        species == other.species &&
        rejectReason == other.rejectReason &&
        receivedAt == other.receivedAt &&
        receivedVolumeValue == other.receivedVolumeValue &&
        receivedVolumeUnit == other.receivedVolumeUnit &&
        receivedLabStorageDetails == other.receivedLabStorageDetails &&
        referenceBatchId == other.referenceBatchId &&
        batchReferenceDocument == other.batchReferenceDocument &&
        accessionId == other.accessionId &&
        extractionDateTime == other.extractionDateTime &&
        extractionSampleUsedValue == other.extractionSampleUsedValue &&
        extractionSampleUsedUnit == other.extractionSampleUsedUnit &&
        extractionSampleRemainingValue ==
            other.extractionSampleRemainingValue &&
        extractionSampleRemainingUnit == other.extractionSampleRemainingUnit &&
        extractionComments == other.extractionComments &&
        preprocessingSteps == other.preprocessingSteps &&
        preprocessingDate == other.preprocessingDate &&
        preprocessingStorageTemperature ==
            other.preprocessingStorageTemperature &&
        preprocessingStorageDetails == other.preprocessingStorageDetails &&
        preprocessingPerformedBy == other.preprocessingPerformedBy &&
        pooledSampleIds == other.pooledSampleIds &&
        pooledWith == other.pooledWith &&
        isPooledSample == other.isPooledSample &&
        details == other.details;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, quantity.hashCode);
    _$hash = $jc(_$hash, replicates.hashCode);
    _$hash = $jc(_$hash, unit.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, originalSampleBarcode.hashCode);
    _$hash = $jc(_$hash, site.hashCode);
    _$hash = $jc(_$hash, team.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, testDate.hashCode);
    _$hash = $jc(_$hash, collectedBy.hashCode);
    _$hash = $jc(_$hash, receivedBy.hashCode);
    _$hash = $jc(_$hash, extractedBy.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, reportGeneratedBy.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, sampleStatus.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, visit.hashCode);
    _$hash = $jc(_$hash, sampleType.hashCode);
    _$hash = $jc(_$hash, species.hashCode);
    _$hash = $jc(_$hash, rejectReason.hashCode);
    _$hash = $jc(_$hash, receivedAt.hashCode);
    _$hash = $jc(_$hash, receivedVolumeValue.hashCode);
    _$hash = $jc(_$hash, receivedVolumeUnit.hashCode);
    _$hash = $jc(_$hash, receivedLabStorageDetails.hashCode);
    _$hash = $jc(_$hash, referenceBatchId.hashCode);
    _$hash = $jc(_$hash, batchReferenceDocument.hashCode);
    _$hash = $jc(_$hash, accessionId.hashCode);
    _$hash = $jc(_$hash, extractionDateTime.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedUnit.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingUnit.hashCode);
    _$hash = $jc(_$hash, extractionComments.hashCode);
    _$hash = $jc(_$hash, preprocessingSteps.hashCode);
    _$hash = $jc(_$hash, preprocessingDate.hashCode);
    _$hash = $jc(_$hash, preprocessingStorageTemperature.hashCode);
    _$hash = $jc(_$hash, preprocessingStorageDetails.hashCode);
    _$hash = $jc(_$hash, preprocessingPerformedBy.hashCode);
    _$hash = $jc(_$hash, pooledSampleIds.hashCode);
    _$hash = $jc(_$hash, pooledWith.hashCode);
    _$hash = $jc(_$hash, isPooledSample.hashCode);
    _$hash = $jc(_$hash, details.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateSampleDto')
          ..add('quantity', quantity)
          ..add('replicates', replicates)
          ..add('unit', unit)
          ..add('photos', photos)
          ..add('barcode', barcode)
          ..add('originalSampleBarcode', originalSampleBarcode)
          ..add('site', site)
          ..add('team', team)
          ..add('diseases', diseases)
          ..add('testDate', testDate)
          ..add('collectedBy', collectedBy)
          ..add('receivedBy', receivedBy)
          ..add('extractedBy', extractedBy)
          ..add('testedBy', testedBy)
          ..add('reportGeneratedBy', reportGeneratedBy)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('sampleStatus', sampleStatus)
          ..add('comment', comment)
          ..add('visit', visit)
          ..add('sampleType', sampleType)
          ..add('species', species)
          ..add('rejectReason', rejectReason)
          ..add('receivedAt', receivedAt)
          ..add('receivedVolumeValue', receivedVolumeValue)
          ..add('receivedVolumeUnit', receivedVolumeUnit)
          ..add('receivedLabStorageDetails', receivedLabStorageDetails)
          ..add('referenceBatchId', referenceBatchId)
          ..add('batchReferenceDocument', batchReferenceDocument)
          ..add('accessionId', accessionId)
          ..add('extractionDateTime', extractionDateTime)
          ..add('extractionSampleUsedValue', extractionSampleUsedValue)
          ..add('extractionSampleUsedUnit', extractionSampleUsedUnit)
          ..add(
              'extractionSampleRemainingValue', extractionSampleRemainingValue)
          ..add('extractionSampleRemainingUnit', extractionSampleRemainingUnit)
          ..add('extractionComments', extractionComments)
          ..add('preprocessingSteps', preprocessingSteps)
          ..add('preprocessingDate', preprocessingDate)
          ..add('preprocessingStorageTemperature',
              preprocessingStorageTemperature)
          ..add('preprocessingStorageDetails', preprocessingStorageDetails)
          ..add('preprocessingPerformedBy', preprocessingPerformedBy)
          ..add('pooledSampleIds', pooledSampleIds)
          ..add('pooledWith', pooledWith)
          ..add('isPooledSample', isPooledSample)
          ..add('details', details))
        .toString();
  }
}

class CreateSampleDtoBuilder
    implements Builder<CreateSampleDto, CreateSampleDtoBuilder> {
  _$CreateSampleDto? _$v;

  num? _quantity;
  num? get quantity => _$this._quantity;
  set quantity(num? quantity) => _$this._quantity = quantity;

  CreateSampleDtoReplicatesEnum? _replicates;
  CreateSampleDtoReplicatesEnum? get replicates => _$this._replicates;
  set replicates(CreateSampleDtoReplicatesEnum? replicates) =>
      _$this._replicates = replicates;

  String? _unit;
  String? get unit => _$this._unit;
  set unit(String? unit) => _$this._unit = unit;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  String? _originalSampleBarcode;
  String? get originalSampleBarcode => _$this._originalSampleBarcode;
  set originalSampleBarcode(String? originalSampleBarcode) =>
      _$this._originalSampleBarcode = originalSampleBarcode;

  JsonObject? _site;
  JsonObject? get site => _$this._site;
  set site(JsonObject? site) => _$this._site = site;

  JsonObject? _team;
  JsonObject? get team => _$this._team;
  set team(JsonObject? team) => _$this._team = team;

  ListBuilder<JsonObject>? _diseases;
  ListBuilder<JsonObject> get diseases =>
      _$this._diseases ??= ListBuilder<JsonObject>();
  set diseases(ListBuilder<JsonObject>? diseases) =>
      _$this._diseases = diseases;

  DateTime? _testDate;
  DateTime? get testDate => _$this._testDate;
  set testDate(DateTime? testDate) => _$this._testDate = testDate;

  JsonObject? _collectedBy;
  JsonObject? get collectedBy => _$this._collectedBy;
  set collectedBy(JsonObject? collectedBy) => _$this._collectedBy = collectedBy;

  JsonObject? _receivedBy;
  JsonObject? get receivedBy => _$this._receivedBy;
  set receivedBy(JsonObject? receivedBy) => _$this._receivedBy = receivedBy;

  JsonObject? _extractedBy;
  JsonObject? get extractedBy => _$this._extractedBy;
  set extractedBy(JsonObject? extractedBy) => _$this._extractedBy = extractedBy;

  JsonObject? _testedBy;
  JsonObject? get testedBy => _$this._testedBy;
  set testedBy(JsonObject? testedBy) => _$this._testedBy = testedBy;

  JsonObject? _reportGeneratedBy;
  JsonObject? get reportGeneratedBy => _$this._reportGeneratedBy;
  set reportGeneratedBy(JsonObject? reportGeneratedBy) =>
      _$this._reportGeneratedBy = reportGeneratedBy;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  CreateSampleDtoSampleStatusEnum? _sampleStatus;
  CreateSampleDtoSampleStatusEnum? get sampleStatus => _$this._sampleStatus;
  set sampleStatus(CreateSampleDtoSampleStatusEnum? sampleStatus) =>
      _$this._sampleStatus = sampleStatus;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  JsonObject? _visit;
  JsonObject? get visit => _$this._visit;
  set visit(JsonObject? visit) => _$this._visit = visit;

  JsonObject? _sampleType;
  JsonObject? get sampleType => _$this._sampleType;
  set sampleType(JsonObject? sampleType) => _$this._sampleType = sampleType;

  JsonObject? _species;
  JsonObject? get species => _$this._species;
  set species(JsonObject? species) => _$this._species = species;

  String? _rejectReason;
  String? get rejectReason => _$this._rejectReason;
  set rejectReason(String? rejectReason) => _$this._rejectReason = rejectReason;

  DateTime? _receivedAt;
  DateTime? get receivedAt => _$this._receivedAt;
  set receivedAt(DateTime? receivedAt) => _$this._receivedAt = receivedAt;

  String? _receivedVolumeValue;
  String? get receivedVolumeValue => _$this._receivedVolumeValue;
  set receivedVolumeValue(String? receivedVolumeValue) =>
      _$this._receivedVolumeValue = receivedVolumeValue;

  String? _receivedVolumeUnit;
  String? get receivedVolumeUnit => _$this._receivedVolumeUnit;
  set receivedVolumeUnit(String? receivedVolumeUnit) =>
      _$this._receivedVolumeUnit = receivedVolumeUnit;

  String? _receivedLabStorageDetails;
  String? get receivedLabStorageDetails => _$this._receivedLabStorageDetails;
  set receivedLabStorageDetails(String? receivedLabStorageDetails) =>
      _$this._receivedLabStorageDetails = receivedLabStorageDetails;

  String? _referenceBatchId;
  String? get referenceBatchId => _$this._referenceBatchId;
  set referenceBatchId(String? referenceBatchId) =>
      _$this._referenceBatchId = referenceBatchId;

  String? _batchReferenceDocument;
  String? get batchReferenceDocument => _$this._batchReferenceDocument;
  set batchReferenceDocument(String? batchReferenceDocument) =>
      _$this._batchReferenceDocument = batchReferenceDocument;

  String? _accessionId;
  String? get accessionId => _$this._accessionId;
  set accessionId(String? accessionId) => _$this._accessionId = accessionId;

  DateTime? _extractionDateTime;
  DateTime? get extractionDateTime => _$this._extractionDateTime;
  set extractionDateTime(DateTime? extractionDateTime) =>
      _$this._extractionDateTime = extractionDateTime;

  String? _extractionSampleUsedValue;
  String? get extractionSampleUsedValue => _$this._extractionSampleUsedValue;
  set extractionSampleUsedValue(String? extractionSampleUsedValue) =>
      _$this._extractionSampleUsedValue = extractionSampleUsedValue;

  String? _extractionSampleUsedUnit;
  String? get extractionSampleUsedUnit => _$this._extractionSampleUsedUnit;
  set extractionSampleUsedUnit(String? extractionSampleUsedUnit) =>
      _$this._extractionSampleUsedUnit = extractionSampleUsedUnit;

  String? _extractionSampleRemainingValue;
  String? get extractionSampleRemainingValue =>
      _$this._extractionSampleRemainingValue;
  set extractionSampleRemainingValue(String? extractionSampleRemainingValue) =>
      _$this._extractionSampleRemainingValue = extractionSampleRemainingValue;

  String? _extractionSampleRemainingUnit;
  String? get extractionSampleRemainingUnit =>
      _$this._extractionSampleRemainingUnit;
  set extractionSampleRemainingUnit(String? extractionSampleRemainingUnit) =>
      _$this._extractionSampleRemainingUnit = extractionSampleRemainingUnit;

  String? _extractionComments;
  String? get extractionComments => _$this._extractionComments;
  set extractionComments(String? extractionComments) =>
      _$this._extractionComments = extractionComments;

  ListBuilder<JsonObject>? _preprocessingSteps;
  ListBuilder<JsonObject> get preprocessingSteps =>
      _$this._preprocessingSteps ??= ListBuilder<JsonObject>();
  set preprocessingSteps(ListBuilder<JsonObject>? preprocessingSteps) =>
      _$this._preprocessingSteps = preprocessingSteps;

  DateTime? _preprocessingDate;
  DateTime? get preprocessingDate => _$this._preprocessingDate;
  set preprocessingDate(DateTime? preprocessingDate) =>
      _$this._preprocessingDate = preprocessingDate;

  String? _preprocessingStorageTemperature;
  String? get preprocessingStorageTemperature =>
      _$this._preprocessingStorageTemperature;
  set preprocessingStorageTemperature(
          String? preprocessingStorageTemperature) =>
      _$this._preprocessingStorageTemperature = preprocessingStorageTemperature;

  String? _preprocessingStorageDetails;
  String? get preprocessingStorageDetails =>
      _$this._preprocessingStorageDetails;
  set preprocessingStorageDetails(String? preprocessingStorageDetails) =>
      _$this._preprocessingStorageDetails = preprocessingStorageDetails;

  JsonObject? _preprocessingPerformedBy;
  JsonObject? get preprocessingPerformedBy => _$this._preprocessingPerformedBy;
  set preprocessingPerformedBy(JsonObject? preprocessingPerformedBy) =>
      _$this._preprocessingPerformedBy = preprocessingPerformedBy;

  ListBuilder<String>? _pooledSampleIds;
  ListBuilder<String> get pooledSampleIds =>
      _$this._pooledSampleIds ??= ListBuilder<String>();
  set pooledSampleIds(ListBuilder<String>? pooledSampleIds) =>
      _$this._pooledSampleIds = pooledSampleIds;

  ListBuilder<JsonObject>? _pooledWith;
  ListBuilder<JsonObject> get pooledWith =>
      _$this._pooledWith ??= ListBuilder<JsonObject>();
  set pooledWith(ListBuilder<JsonObject>? pooledWith) =>
      _$this._pooledWith = pooledWith;

  bool? _isPooledSample;
  bool? get isPooledSample => _$this._isPooledSample;
  set isPooledSample(bool? isPooledSample) =>
      _$this._isPooledSample = isPooledSample;

  JsonObject? _details;
  JsonObject? get details => _$this._details;
  set details(JsonObject? details) => _$this._details = details;

  CreateSampleDtoBuilder() {
    CreateSampleDto._defaults(this);
  }

  CreateSampleDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _quantity = $v.quantity;
      _replicates = $v.replicates;
      _unit = $v.unit;
      _photos = $v.photos?.toBuilder();
      _barcode = $v.barcode;
      _originalSampleBarcode = $v.originalSampleBarcode;
      _site = $v.site;
      _team = $v.team;
      _diseases = $v.diseases.toBuilder();
      _testDate = $v.testDate;
      _collectedBy = $v.collectedBy;
      _receivedBy = $v.receivedBy;
      _extractedBy = $v.extractedBy;
      _testedBy = $v.testedBy;
      _reportGeneratedBy = $v.reportGeneratedBy;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _sampleStatus = $v.sampleStatus;
      _comment = $v.comment;
      _visit = $v.visit;
      _sampleType = $v.sampleType;
      _species = $v.species;
      _rejectReason = $v.rejectReason;
      _receivedAt = $v.receivedAt;
      _receivedVolumeValue = $v.receivedVolumeValue;
      _receivedVolumeUnit = $v.receivedVolumeUnit;
      _receivedLabStorageDetails = $v.receivedLabStorageDetails;
      _referenceBatchId = $v.referenceBatchId;
      _batchReferenceDocument = $v.batchReferenceDocument;
      _accessionId = $v.accessionId;
      _extractionDateTime = $v.extractionDateTime;
      _extractionSampleUsedValue = $v.extractionSampleUsedValue;
      _extractionSampleUsedUnit = $v.extractionSampleUsedUnit;
      _extractionSampleRemainingValue = $v.extractionSampleRemainingValue;
      _extractionSampleRemainingUnit = $v.extractionSampleRemainingUnit;
      _extractionComments = $v.extractionComments;
      _preprocessingSteps = $v.preprocessingSteps?.toBuilder();
      _preprocessingDate = $v.preprocessingDate;
      _preprocessingStorageTemperature = $v.preprocessingStorageTemperature;
      _preprocessingStorageDetails = $v.preprocessingStorageDetails;
      _preprocessingPerformedBy = $v.preprocessingPerformedBy;
      _pooledSampleIds = $v.pooledSampleIds?.toBuilder();
      _pooledWith = $v.pooledWith?.toBuilder();
      _isPooledSample = $v.isPooledSample;
      _details = $v.details;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateSampleDto other) {
    _$v = other as _$CreateSampleDto;
  }

  @override
  void update(void Function(CreateSampleDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateSampleDto build() => _build();

  _$CreateSampleDto _build() {
    _$CreateSampleDto _$result;
    try {
      _$result = _$v ??
          _$CreateSampleDto._(
            quantity: quantity,
            replicates: replicates,
            unit: unit,
            photos: _photos?.build(),
            barcode: BuiltValueNullFieldError.checkNotNull(
                barcode, r'CreateSampleDto', 'barcode'),
            originalSampleBarcode: originalSampleBarcode,
            site: BuiltValueNullFieldError.checkNotNull(
                site, r'CreateSampleDto', 'site'),
            team: BuiltValueNullFieldError.checkNotNull(
                team, r'CreateSampleDto', 'team'),
            diseases: diseases.build(),
            testDate: testDate,
            collectedBy: collectedBy,
            receivedBy: receivedBy,
            extractedBy: extractedBy,
            testedBy: testedBy,
            reportGeneratedBy: reportGeneratedBy,
            latitude: latitude,
            longitude: longitude,
            sampleStatus: sampleStatus,
            comment: comment,
            visit: BuiltValueNullFieldError.checkNotNull(
                visit, r'CreateSampleDto', 'visit'),
            sampleType: BuiltValueNullFieldError.checkNotNull(
                sampleType, r'CreateSampleDto', 'sampleType'),
            species: species,
            rejectReason: rejectReason,
            receivedAt: receivedAt,
            receivedVolumeValue: receivedVolumeValue,
            receivedVolumeUnit: receivedVolumeUnit,
            receivedLabStorageDetails: receivedLabStorageDetails,
            referenceBatchId: referenceBatchId,
            batchReferenceDocument: batchReferenceDocument,
            accessionId: accessionId,
            extractionDateTime: extractionDateTime,
            extractionSampleUsedValue: extractionSampleUsedValue,
            extractionSampleUsedUnit: extractionSampleUsedUnit,
            extractionSampleRemainingValue: extractionSampleRemainingValue,
            extractionSampleRemainingUnit: extractionSampleRemainingUnit,
            extractionComments: extractionComments,
            preprocessingSteps: _preprocessingSteps?.build(),
            preprocessingDate: preprocessingDate,
            preprocessingStorageTemperature: preprocessingStorageTemperature,
            preprocessingStorageDetails: preprocessingStorageDetails,
            preprocessingPerformedBy: preprocessingPerformedBy,
            pooledSampleIds: _pooledSampleIds?.build(),
            pooledWith: _pooledWith?.build(),
            isPooledSample: isPooledSample,
            details: details,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        _photos?.build();

        _$failedField = 'diseases';
        diseases.build();

        _$failedField = 'preprocessingSteps';
        _preprocessingSteps?.build();

        _$failedField = 'pooledSampleIds';
        _pooledSampleIds?.build();
        _$failedField = 'pooledWith';
        _pooledWith?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateSampleDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
