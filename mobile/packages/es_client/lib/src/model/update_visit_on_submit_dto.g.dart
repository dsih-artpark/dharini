// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_visit_on_submit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateVisitOnSubmitDto extends UpdateVisitOnSubmitDto {
  @override
  final DateTime? visitStartedAt;
  @override
  final VisitStatus visitStatus;
  @override
  final String? siteId;
  @override
  final String? projectId;
  @override
  final String? teamId;
  @override
  final String? visitedBy;
  @override
  final BuiltList<String>? photos;
  @override
  final String? comment;
  @override
  final BuiltList<String>? suspectDiseaseData;
  @override
  final JsonObject? diseaseQuestionnaireData;
  @override
  final num? latitude;
  @override
  final num? longitude;
  @override
  final DateTime? visitedAt;
  @override
  final bool isCompleted;

  factory _$UpdateVisitOnSubmitDto(
          [void Function(UpdateVisitOnSubmitDtoBuilder)? updates]) =>
      (UpdateVisitOnSubmitDtoBuilder()..update(updates))._build();

  _$UpdateVisitOnSubmitDto._(
      {this.visitStartedAt,
      required this.visitStatus,
      this.siteId,
      this.projectId,
      this.teamId,
      this.visitedBy,
      this.photos,
      this.comment,
      this.suspectDiseaseData,
      this.diseaseQuestionnaireData,
      this.latitude,
      this.longitude,
      this.visitedAt,
      required this.isCompleted})
      : super._();
  @override
  UpdateVisitOnSubmitDto rebuild(
          void Function(UpdateVisitOnSubmitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateVisitOnSubmitDtoBuilder toBuilder() =>
      UpdateVisitOnSubmitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateVisitOnSubmitDto &&
        visitStartedAt == other.visitStartedAt &&
        visitStatus == other.visitStatus &&
        siteId == other.siteId &&
        projectId == other.projectId &&
        teamId == other.teamId &&
        visitedBy == other.visitedBy &&
        photos == other.photos &&
        comment == other.comment &&
        suspectDiseaseData == other.suspectDiseaseData &&
        diseaseQuestionnaireData == other.diseaseQuestionnaireData &&
        latitude == other.latitude &&
        longitude == other.longitude &&
        visitedAt == other.visitedAt &&
        isCompleted == other.isCompleted;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitStartedAt.hashCode);
    _$hash = $jc(_$hash, visitStatus.hashCode);
    _$hash = $jc(_$hash, siteId.hashCode);
    _$hash = $jc(_$hash, projectId.hashCode);
    _$hash = $jc(_$hash, teamId.hashCode);
    _$hash = $jc(_$hash, visitedBy.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, suspectDiseaseData.hashCode);
    _$hash = $jc(_$hash, diseaseQuestionnaireData.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, visitedAt.hashCode);
    _$hash = $jc(_$hash, isCompleted.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateVisitOnSubmitDto')
          ..add('visitStartedAt', visitStartedAt)
          ..add('visitStatus', visitStatus)
          ..add('siteId', siteId)
          ..add('projectId', projectId)
          ..add('teamId', teamId)
          ..add('visitedBy', visitedBy)
          ..add('photos', photos)
          ..add('comment', comment)
          ..add('suspectDiseaseData', suspectDiseaseData)
          ..add('diseaseQuestionnaireData', diseaseQuestionnaireData)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('visitedAt', visitedAt)
          ..add('isCompleted', isCompleted))
        .toString();
  }
}

class UpdateVisitOnSubmitDtoBuilder
    implements Builder<UpdateVisitOnSubmitDto, UpdateVisitOnSubmitDtoBuilder> {
  _$UpdateVisitOnSubmitDto? _$v;

  DateTime? _visitStartedAt;
  DateTime? get visitStartedAt => _$this._visitStartedAt;
  set visitStartedAt(DateTime? visitStartedAt) =>
      _$this._visitStartedAt = visitStartedAt;

  VisitStatus? _visitStatus;
  VisitStatus? get visitStatus => _$this._visitStatus;
  set visitStatus(VisitStatus? visitStatus) =>
      _$this._visitStatus = visitStatus;

  String? _siteId;
  String? get siteId => _$this._siteId;
  set siteId(String? siteId) => _$this._siteId = siteId;

  String? _projectId;
  String? get projectId => _$this._projectId;
  set projectId(String? projectId) => _$this._projectId = projectId;

  String? _teamId;
  String? get teamId => _$this._teamId;
  set teamId(String? teamId) => _$this._teamId = teamId;

  String? _visitedBy;
  String? get visitedBy => _$this._visitedBy;
  set visitedBy(String? visitedBy) => _$this._visitedBy = visitedBy;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  ListBuilder<String>? _suspectDiseaseData;
  ListBuilder<String> get suspectDiseaseData =>
      _$this._suspectDiseaseData ??= ListBuilder<String>();
  set suspectDiseaseData(ListBuilder<String>? suspectDiseaseData) =>
      _$this._suspectDiseaseData = suspectDiseaseData;

  JsonObject? _diseaseQuestionnaireData;
  JsonObject? get diseaseQuestionnaireData => _$this._diseaseQuestionnaireData;
  set diseaseQuestionnaireData(JsonObject? diseaseQuestionnaireData) =>
      _$this._diseaseQuestionnaireData = diseaseQuestionnaireData;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  DateTime? _visitedAt;
  DateTime? get visitedAt => _$this._visitedAt;
  set visitedAt(DateTime? visitedAt) => _$this._visitedAt = visitedAt;

  bool? _isCompleted;
  bool? get isCompleted => _$this._isCompleted;
  set isCompleted(bool? isCompleted) => _$this._isCompleted = isCompleted;

  UpdateVisitOnSubmitDtoBuilder() {
    UpdateVisitOnSubmitDto._defaults(this);
  }

  UpdateVisitOnSubmitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitStartedAt = $v.visitStartedAt;
      _visitStatus = $v.visitStatus;
      _siteId = $v.siteId;
      _projectId = $v.projectId;
      _teamId = $v.teamId;
      _visitedBy = $v.visitedBy;
      _photos = $v.photos?.toBuilder();
      _comment = $v.comment;
      _suspectDiseaseData = $v.suspectDiseaseData?.toBuilder();
      _diseaseQuestionnaireData = $v.diseaseQuestionnaireData;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _visitedAt = $v.visitedAt;
      _isCompleted = $v.isCompleted;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateVisitOnSubmitDto other) {
    _$v = other as _$UpdateVisitOnSubmitDto;
  }

  @override
  void update(void Function(UpdateVisitOnSubmitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateVisitOnSubmitDto build() => _build();

  _$UpdateVisitOnSubmitDto _build() {
    _$UpdateVisitOnSubmitDto _$result;
    try {
      _$result = _$v ??
          _$UpdateVisitOnSubmitDto._(
            visitStartedAt: visitStartedAt,
            visitStatus: BuiltValueNullFieldError.checkNotNull(
                visitStatus, r'UpdateVisitOnSubmitDto', 'visitStatus'),
            siteId: siteId,
            projectId: projectId,
            teamId: teamId,
            visitedBy: visitedBy,
            photos: _photos?.build(),
            comment: comment,
            suspectDiseaseData: _suspectDiseaseData?.build(),
            diseaseQuestionnaireData: diseaseQuestionnaireData,
            latitude: latitude,
            longitude: longitude,
            visitedAt: visitedAt,
            isCompleted: BuiltValueNullFieldError.checkNotNull(
                isCompleted, r'UpdateVisitOnSubmitDto', 'isCompleted'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        _photos?.build();

        _$failedField = 'suspectDiseaseData';
        _suspectDiseaseData?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateVisitOnSubmitDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
