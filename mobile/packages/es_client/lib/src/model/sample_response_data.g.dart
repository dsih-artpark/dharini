// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleResponseData extends SampleResponseData {
  @override
  final ReplicateAvailability? replicates;
  @override
  final SampleStatus sampleStatus;
  @override
  final String barcode;
  @override
  final Project? project;
  @override
  final SiteResponseData? site;
  @override
  final BuiltList<Disease>? diseases;
  @override
  final Team? team;
  @override
  final Location? location;
  @override
  final Visit? visit;
  @override
  final BuiltList<LabTestResponseData>? labTests;
  @override
  final bool? hasAI;
  @override
  final String? originalSampleId;
  @override
  final String id;
  @override
  final String? sampleCode;
  @override
  final DateTime collectedAt;
  @override
  final num? quantity;
  @override
  final String? unit;
  @override
  final String? habitat;
  @override
  final String? conc;
  @override
  final DateTime collectionTime;
  @override
  final BuiltList<String> photos;
  @override
  final String? comment;
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
  final User? receivedBy;
  @override
  final User? extractedBy;
  @override
  final User? collectedBy;
  @override
  final User? reportGeneratedBy;

  factory _$SampleResponseData(
          [void Function(SampleResponseDataBuilder)? updates]) =>
      (SampleResponseDataBuilder()..update(updates))._build();

  _$SampleResponseData._(
      {this.replicates,
      required this.sampleStatus,
      required this.barcode,
      this.project,
      this.site,
      this.diseases,
      this.team,
      this.location,
      this.visit,
      this.labTests,
      this.hasAI,
      this.originalSampleId,
      required this.id,
      this.sampleCode,
      required this.collectedAt,
      this.quantity,
      this.unit,
      this.habitat,
      this.conc,
      required this.collectionTime,
      required this.photos,
      this.comment,
      this.rejectReason,
      this.receivedAt,
      this.receivedVolumeValue,
      this.receivedVolumeUnit,
      this.receivedLabStorageDetails,
      this.extractionDateTime,
      this.extractionSampleUsedValue,
      this.extractionSampleUsedUnit,
      this.extractionSampleRemainingValue,
      this.extractionSampleRemainingUnit,
      this.extractionComments,
      this.receivedBy,
      this.extractedBy,
      this.collectedBy,
      this.reportGeneratedBy})
      : super._();
  @override
  SampleResponseData rebuild(
          void Function(SampleResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleResponseDataBuilder toBuilder() =>
      SampleResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleResponseData &&
        replicates == other.replicates &&
        sampleStatus == other.sampleStatus &&
        barcode == other.barcode &&
        project == other.project &&
        site == other.site &&
        diseases == other.diseases &&
        team == other.team &&
        location == other.location &&
        visit == other.visit &&
        labTests == other.labTests &&
        hasAI == other.hasAI &&
        originalSampleId == other.originalSampleId &&
        id == other.id &&
        sampleCode == other.sampleCode &&
        collectedAt == other.collectedAt &&
        quantity == other.quantity &&
        unit == other.unit &&
        habitat == other.habitat &&
        conc == other.conc &&
        collectionTime == other.collectionTime &&
        photos == other.photos &&
        comment == other.comment &&
        rejectReason == other.rejectReason &&
        receivedAt == other.receivedAt &&
        receivedVolumeValue == other.receivedVolumeValue &&
        receivedVolumeUnit == other.receivedVolumeUnit &&
        receivedLabStorageDetails == other.receivedLabStorageDetails &&
        extractionDateTime == other.extractionDateTime &&
        extractionSampleUsedValue == other.extractionSampleUsedValue &&
        extractionSampleUsedUnit == other.extractionSampleUsedUnit &&
        extractionSampleRemainingValue ==
            other.extractionSampleRemainingValue &&
        extractionSampleRemainingUnit == other.extractionSampleRemainingUnit &&
        extractionComments == other.extractionComments &&
        receivedBy == other.receivedBy &&
        extractedBy == other.extractedBy &&
        collectedBy == other.collectedBy &&
        reportGeneratedBy == other.reportGeneratedBy;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, replicates.hashCode);
    _$hash = $jc(_$hash, sampleStatus.hashCode);
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, site.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, team.hashCode);
    _$hash = $jc(_$hash, location.hashCode);
    _$hash = $jc(_$hash, visit.hashCode);
    _$hash = $jc(_$hash, labTests.hashCode);
    _$hash = $jc(_$hash, hasAI.hashCode);
    _$hash = $jc(_$hash, originalSampleId.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, sampleCode.hashCode);
    _$hash = $jc(_$hash, collectedAt.hashCode);
    _$hash = $jc(_$hash, quantity.hashCode);
    _$hash = $jc(_$hash, unit.hashCode);
    _$hash = $jc(_$hash, habitat.hashCode);
    _$hash = $jc(_$hash, conc.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, rejectReason.hashCode);
    _$hash = $jc(_$hash, receivedAt.hashCode);
    _$hash = $jc(_$hash, receivedVolumeValue.hashCode);
    _$hash = $jc(_$hash, receivedVolumeUnit.hashCode);
    _$hash = $jc(_$hash, receivedLabStorageDetails.hashCode);
    _$hash = $jc(_$hash, extractionDateTime.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleUsedUnit.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingValue.hashCode);
    _$hash = $jc(_$hash, extractionSampleRemainingUnit.hashCode);
    _$hash = $jc(_$hash, extractionComments.hashCode);
    _$hash = $jc(_$hash, receivedBy.hashCode);
    _$hash = $jc(_$hash, extractedBy.hashCode);
    _$hash = $jc(_$hash, collectedBy.hashCode);
    _$hash = $jc(_$hash, reportGeneratedBy.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleResponseData')
          ..add('replicates', replicates)
          ..add('sampleStatus', sampleStatus)
          ..add('barcode', barcode)
          ..add('project', project)
          ..add('site', site)
          ..add('diseases', diseases)
          ..add('team', team)
          ..add('location', location)
          ..add('visit', visit)
          ..add('labTests', labTests)
          ..add('hasAI', hasAI)
          ..add('originalSampleId', originalSampleId)
          ..add('id', id)
          ..add('sampleCode', sampleCode)
          ..add('collectedAt', collectedAt)
          ..add('quantity', quantity)
          ..add('unit', unit)
          ..add('habitat', habitat)
          ..add('conc', conc)
          ..add('collectionTime', collectionTime)
          ..add('photos', photos)
          ..add('comment', comment)
          ..add('rejectReason', rejectReason)
          ..add('receivedAt', receivedAt)
          ..add('receivedVolumeValue', receivedVolumeValue)
          ..add('receivedVolumeUnit', receivedVolumeUnit)
          ..add('receivedLabStorageDetails', receivedLabStorageDetails)
          ..add('extractionDateTime', extractionDateTime)
          ..add('extractionSampleUsedValue', extractionSampleUsedValue)
          ..add('extractionSampleUsedUnit', extractionSampleUsedUnit)
          ..add(
              'extractionSampleRemainingValue', extractionSampleRemainingValue)
          ..add('extractionSampleRemainingUnit', extractionSampleRemainingUnit)
          ..add('extractionComments', extractionComments)
          ..add('receivedBy', receivedBy)
          ..add('extractedBy', extractedBy)
          ..add('collectedBy', collectedBy)
          ..add('reportGeneratedBy', reportGeneratedBy))
        .toString();
  }
}

class SampleResponseDataBuilder
    implements Builder<SampleResponseData, SampleResponseDataBuilder> {
  _$SampleResponseData? _$v;

  ReplicateAvailability? _replicates;
  ReplicateAvailability? get replicates => _$this._replicates;
  set replicates(ReplicateAvailability? replicates) =>
      _$this._replicates = replicates;

  SampleStatus? _sampleStatus;
  SampleStatus? get sampleStatus => _$this._sampleStatus;
  set sampleStatus(SampleStatus? sampleStatus) =>
      _$this._sampleStatus = sampleStatus;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  ProjectBuilder? _project;
  ProjectBuilder get project => _$this._project ??= ProjectBuilder();
  set project(ProjectBuilder? project) => _$this._project = project;

  SiteResponseDataBuilder? _site;
  SiteResponseDataBuilder get site =>
      _$this._site ??= SiteResponseDataBuilder();
  set site(SiteResponseDataBuilder? site) => _$this._site = site;

  ListBuilder<Disease>? _diseases;
  ListBuilder<Disease> get diseases =>
      _$this._diseases ??= ListBuilder<Disease>();
  set diseases(ListBuilder<Disease>? diseases) => _$this._diseases = diseases;

  TeamBuilder? _team;
  TeamBuilder get team => _$this._team ??= TeamBuilder();
  set team(TeamBuilder? team) => _$this._team = team;

  LocationBuilder? _location;
  LocationBuilder get location => _$this._location ??= LocationBuilder();
  set location(LocationBuilder? location) => _$this._location = location;

  VisitBuilder? _visit;
  VisitBuilder get visit => _$this._visit ??= VisitBuilder();
  set visit(VisitBuilder? visit) => _$this._visit = visit;

  ListBuilder<LabTestResponseData>? _labTests;
  ListBuilder<LabTestResponseData> get labTests =>
      _$this._labTests ??= ListBuilder<LabTestResponseData>();
  set labTests(ListBuilder<LabTestResponseData>? labTests) =>
      _$this._labTests = labTests;

  bool? _hasAI;
  bool? get hasAI => _$this._hasAI;
  set hasAI(bool? hasAI) => _$this._hasAI = hasAI;

  String? _originalSampleId;
  String? get originalSampleId => _$this._originalSampleId;
  set originalSampleId(String? originalSampleId) =>
      _$this._originalSampleId = originalSampleId;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _sampleCode;
  String? get sampleCode => _$this._sampleCode;
  set sampleCode(String? sampleCode) => _$this._sampleCode = sampleCode;

  DateTime? _collectedAt;
  DateTime? get collectedAt => _$this._collectedAt;
  set collectedAt(DateTime? collectedAt) => _$this._collectedAt = collectedAt;

  num? _quantity;
  num? get quantity => _$this._quantity;
  set quantity(num? quantity) => _$this._quantity = quantity;

  String? _unit;
  String? get unit => _$this._unit;
  set unit(String? unit) => _$this._unit = unit;

  String? _habitat;
  String? get habitat => _$this._habitat;
  set habitat(String? habitat) => _$this._habitat = habitat;

  String? _conc;
  String? get conc => _$this._conc;
  set conc(String? conc) => _$this._conc = conc;

  DateTime? _collectionTime;
  DateTime? get collectionTime => _$this._collectionTime;
  set collectionTime(DateTime? collectionTime) =>
      _$this._collectionTime = collectionTime;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

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

  UserBuilder? _receivedBy;
  UserBuilder get receivedBy => _$this._receivedBy ??= UserBuilder();
  set receivedBy(UserBuilder? receivedBy) => _$this._receivedBy = receivedBy;

  UserBuilder? _extractedBy;
  UserBuilder get extractedBy => _$this._extractedBy ??= UserBuilder();
  set extractedBy(UserBuilder? extractedBy) =>
      _$this._extractedBy = extractedBy;

  UserBuilder? _collectedBy;
  UserBuilder get collectedBy => _$this._collectedBy ??= UserBuilder();
  set collectedBy(UserBuilder? collectedBy) =>
      _$this._collectedBy = collectedBy;

  UserBuilder? _reportGeneratedBy;
  UserBuilder get reportGeneratedBy =>
      _$this._reportGeneratedBy ??= UserBuilder();
  set reportGeneratedBy(UserBuilder? reportGeneratedBy) =>
      _$this._reportGeneratedBy = reportGeneratedBy;

  SampleResponseDataBuilder() {
    SampleResponseData._defaults(this);
  }

  SampleResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _replicates = $v.replicates;
      _sampleStatus = $v.sampleStatus;
      _barcode = $v.barcode;
      _project = $v.project?.toBuilder();
      _site = $v.site?.toBuilder();
      _diseases = $v.diseases?.toBuilder();
      _team = $v.team?.toBuilder();
      _location = $v.location?.toBuilder();
      _visit = $v.visit?.toBuilder();
      _labTests = $v.labTests?.toBuilder();
      _hasAI = $v.hasAI;
      _originalSampleId = $v.originalSampleId;
      _id = $v.id;
      _sampleCode = $v.sampleCode;
      _collectedAt = $v.collectedAt;
      _quantity = $v.quantity;
      _unit = $v.unit;
      _habitat = $v.habitat;
      _conc = $v.conc;
      _collectionTime = $v.collectionTime;
      _photos = $v.photos.toBuilder();
      _comment = $v.comment;
      _rejectReason = $v.rejectReason;
      _receivedAt = $v.receivedAt;
      _receivedVolumeValue = $v.receivedVolumeValue;
      _receivedVolumeUnit = $v.receivedVolumeUnit;
      _receivedLabStorageDetails = $v.receivedLabStorageDetails;
      _extractionDateTime = $v.extractionDateTime;
      _extractionSampleUsedValue = $v.extractionSampleUsedValue;
      _extractionSampleUsedUnit = $v.extractionSampleUsedUnit;
      _extractionSampleRemainingValue = $v.extractionSampleRemainingValue;
      _extractionSampleRemainingUnit = $v.extractionSampleRemainingUnit;
      _extractionComments = $v.extractionComments;
      _receivedBy = $v.receivedBy?.toBuilder();
      _extractedBy = $v.extractedBy?.toBuilder();
      _collectedBy = $v.collectedBy?.toBuilder();
      _reportGeneratedBy = $v.reportGeneratedBy?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleResponseData other) {
    _$v = other as _$SampleResponseData;
  }

  @override
  void update(void Function(SampleResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleResponseData build() => _build();

  _$SampleResponseData _build() {
    _$SampleResponseData _$result;
    try {
      _$result = _$v ??
          _$SampleResponseData._(
            replicates: replicates,
            sampleStatus: BuiltValueNullFieldError.checkNotNull(
                sampleStatus, r'SampleResponseData', 'sampleStatus'),
            barcode: BuiltValueNullFieldError.checkNotNull(
                barcode, r'SampleResponseData', 'barcode'),
            project: _project?.build(),
            site: _site?.build(),
            diseases: _diseases?.build(),
            team: _team?.build(),
            location: _location?.build(),
            visit: _visit?.build(),
            labTests: _labTests?.build(),
            hasAI: hasAI,
            originalSampleId: originalSampleId,
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'SampleResponseData', 'id'),
            sampleCode: sampleCode,
            collectedAt: BuiltValueNullFieldError.checkNotNull(
                collectedAt, r'SampleResponseData', 'collectedAt'),
            quantity: quantity,
            unit: unit,
            habitat: habitat,
            conc: conc,
            collectionTime: BuiltValueNullFieldError.checkNotNull(
                collectionTime, r'SampleResponseData', 'collectionTime'),
            photos: photos.build(),
            comment: comment,
            rejectReason: rejectReason,
            receivedAt: receivedAt,
            receivedVolumeValue: receivedVolumeValue,
            receivedVolumeUnit: receivedVolumeUnit,
            receivedLabStorageDetails: receivedLabStorageDetails,
            extractionDateTime: extractionDateTime,
            extractionSampleUsedValue: extractionSampleUsedValue,
            extractionSampleUsedUnit: extractionSampleUsedUnit,
            extractionSampleRemainingValue: extractionSampleRemainingValue,
            extractionSampleRemainingUnit: extractionSampleRemainingUnit,
            extractionComments: extractionComments,
            receivedBy: _receivedBy?.build(),
            extractedBy: _extractedBy?.build(),
            collectedBy: _collectedBy?.build(),
            reportGeneratedBy: _reportGeneratedBy?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'project';
        _project?.build();
        _$failedField = 'site';
        _site?.build();
        _$failedField = 'diseases';
        _diseases?.build();
        _$failedField = 'team';
        _team?.build();
        _$failedField = 'location';
        _location?.build();
        _$failedField = 'visit';
        _visit?.build();
        _$failedField = 'labTests';
        _labTests?.build();

        _$failedField = 'photos';
        photos.build();

        _$failedField = 'receivedBy';
        _receivedBy?.build();
        _$failedField = 'extractedBy';
        _extractedBy?.build();
        _$failedField = 'collectedBy';
        _collectedBy?.build();
        _$failedField = 'reportGeneratedBy';
        _reportGeneratedBy?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
