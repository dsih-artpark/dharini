// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_sample_stage_details_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateSampleStageDetailsDto extends UpdateSampleStageDetailsDto {
  @override
  final String? barcode;
  @override
  final String? collectedBy;
  @override
  final String? collectionTime;
  @override
  final String? receivedAt;
  @override
  final String? receivedBy;
  @override
  final String? receivedVolumeValue;
  @override
  final String? receivedVolumeUnit;
  @override
  final String? receivedStorageTemperature;
  @override
  final String? receivedLabStorageDetails;
  @override
  final String? referenceBatchId;
  @override
  final String? batchReferenceDocument;
  @override
  final String? accessionId;
  @override
  final String? preprocessingDate;
  @override
  final String? preprocessingPerformedBy;
  @override
  final BuiltList<JsonObject>? preprocessingSteps;
  @override
  final String? extractionDateTime;
  @override
  final String? extractedBy;
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
  final String? testedAt;
  @override
  final String? testedBy;
  @override
  final String? reportGeneratedAt;
  @override
  final String? reportGeneratedBy;
  @override
  final JsonObject? details;
  @override
  final BuiltList<JsonObject>? labTests;

  factory _$UpdateSampleStageDetailsDto(
          [void Function(UpdateSampleStageDetailsDtoBuilder)? updates]) =>
      (UpdateSampleStageDetailsDtoBuilder()..update(updates))._build();

  _$UpdateSampleStageDetailsDto._(
      {this.barcode,
      this.collectedBy,
      this.collectionTime,
      this.receivedAt,
      this.receivedBy,
      this.receivedVolumeValue,
      this.receivedVolumeUnit,
      this.receivedStorageTemperature,
      this.receivedLabStorageDetails,
      this.referenceBatchId,
      this.batchReferenceDocument,
      this.accessionId,
      this.preprocessingDate,
      this.preprocessingPerformedBy,
      this.preprocessingSteps,
      this.extractionDateTime,
      this.extractedBy,
      this.extractionSampleUsedValue,
      this.extractionSampleUsedUnit,
      this.extractionSampleRemainingValue,
      this.extractionSampleRemainingUnit,
      this.extractionComments,
      this.testedAt,
      this.testedBy,
      this.reportGeneratedAt,
      this.reportGeneratedBy,
      this.details,
      this.labTests})
      : super._();
  @override
  UpdateSampleStageDetailsDto rebuild(
          void Function(UpdateSampleStageDetailsDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateSampleStageDetailsDtoBuilder toBuilder() =>
      UpdateSampleStageDetailsDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateSampleStageDetailsDto &&
        barcode == other.barcode &&
        collectedBy == other.collectedBy &&
        collectionTime == other.collectionTime &&
        receivedAt == other.receivedAt &&
        receivedBy == other.receivedBy &&
        receivedVolumeValue == other.receivedVolumeValue &&
        receivedVolumeUnit == other.receivedVolumeUnit &&
        receivedStorageTemperature == other.receivedStorageTemperature &&
        receivedLabStorageDetails == other.receivedLabStorageDetails &&
        referenceBatchId == other.referenceBatchId &&
        batchReferenceDocument == other.batchReferenceDocument &&
        accessionId == other.accessionId &&
        preprocessingDate == other.preprocessingDate &&
        preprocessingPerformedBy == other.preprocessingPerformedBy &&
        preprocessingSteps == other.preprocessingSteps &&
        extractionDateTime == other.extractionDateTime &&
        extractedBy == other.extractedBy &&
        extractionSampleUsedValue == other.extractionSampleUsedValue &&
        extractionSampleUsedUnit == other.extractionSampleUsedUnit &&
        extractionSampleRemainingValue ==
            other.extractionSampleRemainingValue &&
        extractionSampleRemainingUnit == other.extractionSampleRemainingUnit &&
        extractionComments == other.extractionComments &&
        testedAt == other.testedAt &&
        testedBy == other.testedBy &&
        reportGeneratedAt == other.reportGeneratedAt &&
        reportGeneratedBy == other.reportGeneratedBy &&
        details == other.details &&
        labTests == other.labTests;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, collectedBy.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jc(_$hash, receivedAt.hashCode);
    _$hash = $jc(_$hash, receivedBy.hashCode);
    _$hash = $jc(_$hash, receivedVolumeValue.hashCode);
    _$hash = $jc(_$hash, receivedVolumeUnit.hashCode);
    _$hash = $jc(_$hash, receivedStorageTemperature.hashCode);
    _$hash = $jc(_$hash, receivedLabStorageDetails.hashCode);
    _$hash = $jc(_$hash, referenceBatchId.hashCode);
    _$hash = $jc(_$hash, batchReferenceDocument.hashCode);
    _$hash = $jc(_$hash, accessionId.hashCode);
    _$hash = $jc(_$hash, preprocessingDate.hashCode);
    _$hash = $jc(_$hash, preprocessingPerformedBy.hashCode);
    _$hash = $jc(_$hash, preprocessingSteps.hashCode);
    _$hash = $jc(_$hash, extractionDateTime.hashCode);
    _$hash = $jc(_$hash, extractedBy.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedUnit.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingUnit.hashCode);
    _$hash = $jc(_$hash, extractionComments.hashCode);
    _$hash = $jc(_$hash, testedAt.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, reportGeneratedAt.hashCode);
    _$hash = $jc(_$hash, reportGeneratedBy.hashCode);
    _$hash = $jc(_$hash, details.hashCode);
    _$hash = $jc(_$hash, labTests.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateSampleStageDetailsDto')
          ..add('barcode', barcode)
          ..add('collectedBy', collectedBy)
          ..add('collectionTime', collectionTime)
          ..add('receivedAt', receivedAt)
          ..add('receivedBy', receivedBy)
          ..add('receivedVolumeValue', receivedVolumeValue)
          ..add('receivedVolumeUnit', receivedVolumeUnit)
          ..add('receivedStorageTemperature', receivedStorageTemperature)
          ..add('receivedLabStorageDetails', receivedLabStorageDetails)
          ..add('referenceBatchId', referenceBatchId)
          ..add('batchReferenceDocument', batchReferenceDocument)
          ..add('accessionId', accessionId)
          ..add('preprocessingDate', preprocessingDate)
          ..add('preprocessingPerformedBy', preprocessingPerformedBy)
          ..add('preprocessingSteps', preprocessingSteps)
          ..add('extractionDateTime', extractionDateTime)
          ..add('extractedBy', extractedBy)
          ..add('extractionSampleUsedValue', extractionSampleUsedValue)
          ..add('extractionSampleUsedUnit', extractionSampleUsedUnit)
          ..add(
              'extractionSampleRemainingValue', extractionSampleRemainingValue)
          ..add('extractionSampleRemainingUnit', extractionSampleRemainingUnit)
          ..add('extractionComments', extractionComments)
          ..add('testedAt', testedAt)
          ..add('testedBy', testedBy)
          ..add('reportGeneratedAt', reportGeneratedAt)
          ..add('reportGeneratedBy', reportGeneratedBy)
          ..add('details', details)
          ..add('labTests', labTests))
        .toString();
  }
}

class UpdateSampleStageDetailsDtoBuilder
    implements
        Builder<UpdateSampleStageDetailsDto,
            UpdateSampleStageDetailsDtoBuilder> {
  _$UpdateSampleStageDetailsDto? _$v;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  String? _collectedBy;
  String? get collectedBy => _$this._collectedBy;
  set collectedBy(String? collectedBy) => _$this._collectedBy = collectedBy;

  String? _collectionTime;
  String? get collectionTime => _$this._collectionTime;
  set collectionTime(String? collectionTime) =>
      _$this._collectionTime = collectionTime;

  String? _receivedAt;
  String? get receivedAt => _$this._receivedAt;
  set receivedAt(String? receivedAt) => _$this._receivedAt = receivedAt;

  String? _receivedBy;
  String? get receivedBy => _$this._receivedBy;
  set receivedBy(String? receivedBy) => _$this._receivedBy = receivedBy;

  String? _receivedVolumeValue;
  String? get receivedVolumeValue => _$this._receivedVolumeValue;
  set receivedVolumeValue(String? receivedVolumeValue) =>
      _$this._receivedVolumeValue = receivedVolumeValue;

  String? _receivedVolumeUnit;
  String? get receivedVolumeUnit => _$this._receivedVolumeUnit;
  set receivedVolumeUnit(String? receivedVolumeUnit) =>
      _$this._receivedVolumeUnit = receivedVolumeUnit;

  String? _receivedStorageTemperature;
  String? get receivedStorageTemperature => _$this._receivedStorageTemperature;
  set receivedStorageTemperature(String? receivedStorageTemperature) =>
      _$this._receivedStorageTemperature = receivedStorageTemperature;

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

  String? _preprocessingDate;
  String? get preprocessingDate => _$this._preprocessingDate;
  set preprocessingDate(String? preprocessingDate) =>
      _$this._preprocessingDate = preprocessingDate;

  String? _preprocessingPerformedBy;
  String? get preprocessingPerformedBy => _$this._preprocessingPerformedBy;
  set preprocessingPerformedBy(String? preprocessingPerformedBy) =>
      _$this._preprocessingPerformedBy = preprocessingPerformedBy;

  ListBuilder<JsonObject>? _preprocessingSteps;
  ListBuilder<JsonObject> get preprocessingSteps =>
      _$this._preprocessingSteps ??= ListBuilder<JsonObject>();
  set preprocessingSteps(ListBuilder<JsonObject>? preprocessingSteps) =>
      _$this._preprocessingSteps = preprocessingSteps;

  String? _extractionDateTime;
  String? get extractionDateTime => _$this._extractionDateTime;
  set extractionDateTime(String? extractionDateTime) =>
      _$this._extractionDateTime = extractionDateTime;

  String? _extractedBy;
  String? get extractedBy => _$this._extractedBy;
  set extractedBy(String? extractedBy) => _$this._extractedBy = extractedBy;

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

  String? _testedAt;
  String? get testedAt => _$this._testedAt;
  set testedAt(String? testedAt) => _$this._testedAt = testedAt;

  String? _testedBy;
  String? get testedBy => _$this._testedBy;
  set testedBy(String? testedBy) => _$this._testedBy = testedBy;

  String? _reportGeneratedAt;
  String? get reportGeneratedAt => _$this._reportGeneratedAt;
  set reportGeneratedAt(String? reportGeneratedAt) =>
      _$this._reportGeneratedAt = reportGeneratedAt;

  String? _reportGeneratedBy;
  String? get reportGeneratedBy => _$this._reportGeneratedBy;
  set reportGeneratedBy(String? reportGeneratedBy) =>
      _$this._reportGeneratedBy = reportGeneratedBy;

  JsonObject? _details;
  JsonObject? get details => _$this._details;
  set details(JsonObject? details) => _$this._details = details;

  ListBuilder<JsonObject>? _labTests;
  ListBuilder<JsonObject> get labTests =>
      _$this._labTests ??= ListBuilder<JsonObject>();
  set labTests(ListBuilder<JsonObject>? labTests) =>
      _$this._labTests = labTests;

  UpdateSampleStageDetailsDtoBuilder() {
    UpdateSampleStageDetailsDto._defaults(this);
  }

  UpdateSampleStageDetailsDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _barcode = $v.barcode;
      _collectedBy = $v.collectedBy;
      _collectionTime = $v.collectionTime;
      _receivedAt = $v.receivedAt;
      _receivedBy = $v.receivedBy;
      _receivedVolumeValue = $v.receivedVolumeValue;
      _receivedVolumeUnit = $v.receivedVolumeUnit;
      _receivedStorageTemperature = $v.receivedStorageTemperature;
      _receivedLabStorageDetails = $v.receivedLabStorageDetails;
      _referenceBatchId = $v.referenceBatchId;
      _batchReferenceDocument = $v.batchReferenceDocument;
      _accessionId = $v.accessionId;
      _preprocessingDate = $v.preprocessingDate;
      _preprocessingPerformedBy = $v.preprocessingPerformedBy;
      _preprocessingSteps = $v.preprocessingSteps?.toBuilder();
      _extractionDateTime = $v.extractionDateTime;
      _extractedBy = $v.extractedBy;
      _extractionSampleUsedValue = $v.extractionSampleUsedValue;
      _extractionSampleUsedUnit = $v.extractionSampleUsedUnit;
      _extractionSampleRemainingValue = $v.extractionSampleRemainingValue;
      _extractionSampleRemainingUnit = $v.extractionSampleRemainingUnit;
      _extractionComments = $v.extractionComments;
      _testedAt = $v.testedAt;
      _testedBy = $v.testedBy;
      _reportGeneratedAt = $v.reportGeneratedAt;
      _reportGeneratedBy = $v.reportGeneratedBy;
      _details = $v.details;
      _labTests = $v.labTests?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateSampleStageDetailsDto other) {
    _$v = other as _$UpdateSampleStageDetailsDto;
  }

  @override
  void update(void Function(UpdateSampleStageDetailsDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateSampleStageDetailsDto build() => _build();

  _$UpdateSampleStageDetailsDto _build() {
    _$UpdateSampleStageDetailsDto _$result;
    try {
      _$result = _$v ??
          _$UpdateSampleStageDetailsDto._(
            barcode: barcode,
            collectedBy: collectedBy,
            collectionTime: collectionTime,
            receivedAt: receivedAt,
            receivedBy: receivedBy,
            receivedVolumeValue: receivedVolumeValue,
            receivedVolumeUnit: receivedVolumeUnit,
            receivedStorageTemperature: receivedStorageTemperature,
            receivedLabStorageDetails: receivedLabStorageDetails,
            referenceBatchId: referenceBatchId,
            batchReferenceDocument: batchReferenceDocument,
            accessionId: accessionId,
            preprocessingDate: preprocessingDate,
            preprocessingPerformedBy: preprocessingPerformedBy,
            preprocessingSteps: _preprocessingSteps?.build(),
            extractionDateTime: extractionDateTime,
            extractedBy: extractedBy,
            extractionSampleUsedValue: extractionSampleUsedValue,
            extractionSampleUsedUnit: extractionSampleUsedUnit,
            extractionSampleRemainingValue: extractionSampleRemainingValue,
            extractionSampleRemainingUnit: extractionSampleRemainingUnit,
            extractionComments: extractionComments,
            testedAt: testedAt,
            testedBy: testedBy,
            reportGeneratedAt: reportGeneratedAt,
            reportGeneratedBy: reportGeneratedBy,
            details: details,
            labTests: _labTests?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'preprocessingSteps';
        _preprocessingSteps?.build();

        _$failedField = 'labTests';
        _labTests?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateSampleStageDetailsDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
