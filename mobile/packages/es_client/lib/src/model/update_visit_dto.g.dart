// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateVisitDto extends UpdateVisitDto {
  @override
  final DateTime? visitStartedAt;
  @override
  final VisitStatus visitStatus;
  @override
  final String? siteId;
  @override
  final BuiltList<String>? photos;
  @override
  final String? comment;
  @override
  final String? visitedBy;
  @override
  final BuiltList<String>? suspectDiseaseData;
  @override
  final JsonObject? diseaseQuestionnaireData;
  @override
  final JsonObject? environmentalQuestionnaireData;
  @override
  final num? latitude;
  @override
  final num? longitude;
  @override
  final DateTime? visitedAt;
  @override
  final bool isCompleted;

  factory _$UpdateVisitDto([void Function(UpdateVisitDtoBuilder)? updates]) =>
      (UpdateVisitDtoBuilder()..update(updates))._build();

  _$UpdateVisitDto._(
      {this.visitStartedAt,
      required this.visitStatus,
      this.siteId,
      this.photos,
      this.comment,
      this.visitedBy,
      this.suspectDiseaseData,
      this.diseaseQuestionnaireData,
      this.environmentalQuestionnaireData,
      this.latitude,
      this.longitude,
      this.visitedAt,
      required this.isCompleted})
      : super._();
  @override
  UpdateVisitDto rebuild(void Function(UpdateVisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateVisitDtoBuilder toBuilder() => UpdateVisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateVisitDto &&
        visitStartedAt == other.visitStartedAt &&
        visitStatus == other.visitStatus &&
        siteId == other.siteId &&
        photos == other.photos &&
        comment == other.comment &&
        visitedBy == other.visitedBy &&
        suspectDiseaseData == other.suspectDiseaseData &&
        diseaseQuestionnaireData == other.diseaseQuestionnaireData &&
        environmentalQuestionnaireData ==
            other.environmentalQuestionnaireData &&
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
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, visitedBy.hashCode);
    _$hash = $jc(_$hash, suspectDiseaseData.hashCode);
    _$hash = $jc(_$hash, diseaseQuestionnaireData.hashCode);
    _$hash = $jc(_$hash, environmentalQuestionnaireData.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, visitedAt.hashCode);
    _$hash = $jc(_$hash, isCompleted.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateVisitDto')
          ..add('visitStartedAt', visitStartedAt)
          ..add('visitStatus', visitStatus)
          ..add('siteId', siteId)
          ..add('photos', photos)
          ..add('comment', comment)
          ..add('visitedBy', visitedBy)
          ..add('suspectDiseaseData', suspectDiseaseData)
          ..add('diseaseQuestionnaireData', diseaseQuestionnaireData)
          ..add(
              'environmentalQuestionnaireData', environmentalQuestionnaireData)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('visitedAt', visitedAt)
          ..add('isCompleted', isCompleted))
        .toString();
  }
}

class UpdateVisitDtoBuilder
    implements Builder<UpdateVisitDto, UpdateVisitDtoBuilder> {
  _$UpdateVisitDto? _$v;

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

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  String? _visitedBy;
  String? get visitedBy => _$this._visitedBy;
  set visitedBy(String? visitedBy) => _$this._visitedBy = visitedBy;

  ListBuilder<String>? _suspectDiseaseData;
  ListBuilder<String> get suspectDiseaseData =>
      _$this._suspectDiseaseData ??= ListBuilder<String>();
  set suspectDiseaseData(ListBuilder<String>? suspectDiseaseData) =>
      _$this._suspectDiseaseData = suspectDiseaseData;

  JsonObject? _diseaseQuestionnaireData;
  JsonObject? get diseaseQuestionnaireData => _$this._diseaseQuestionnaireData;
  set diseaseQuestionnaireData(JsonObject? diseaseQuestionnaireData) =>
      _$this._diseaseQuestionnaireData = diseaseQuestionnaireData;

  JsonObject? _environmentalQuestionnaireData;
  JsonObject? get environmentalQuestionnaireData =>
      _$this._environmentalQuestionnaireData;
  set environmentalQuestionnaireData(
          JsonObject? environmentalQuestionnaireData) =>
      _$this._environmentalQuestionnaireData = environmentalQuestionnaireData;

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

  UpdateVisitDtoBuilder() {
    UpdateVisitDto._defaults(this);
  }

  UpdateVisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitStartedAt = $v.visitStartedAt;
      _visitStatus = $v.visitStatus;
      _siteId = $v.siteId;
      _photos = $v.photos?.toBuilder();
      _comment = $v.comment;
      _visitedBy = $v.visitedBy;
      _suspectDiseaseData = $v.suspectDiseaseData?.toBuilder();
      _diseaseQuestionnaireData = $v.diseaseQuestionnaireData;
      _environmentalQuestionnaireData = $v.environmentalQuestionnaireData;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _visitedAt = $v.visitedAt;
      _isCompleted = $v.isCompleted;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateVisitDto other) {
    _$v = other as _$UpdateVisitDto;
  }

  @override
  void update(void Function(UpdateVisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateVisitDto build() => _build();

  _$UpdateVisitDto _build() {
    _$UpdateVisitDto _$result;
    try {
      _$result = _$v ??
          _$UpdateVisitDto._(
            visitStartedAt: visitStartedAt,
            visitStatus: BuiltValueNullFieldError.checkNotNull(
                visitStatus, r'UpdateVisitDto', 'visitStatus'),
            siteId: siteId,
            photos: _photos?.build(),
            comment: comment,
            visitedBy: visitedBy,
            suspectDiseaseData: _suspectDiseaseData?.build(),
            diseaseQuestionnaireData: diseaseQuestionnaireData,
            environmentalQuestionnaireData: environmentalQuestionnaireData,
            latitude: latitude,
            longitude: longitude,
            visitedAt: visitedAt,
            isCompleted: BuiltValueNullFieldError.checkNotNull(
                isCompleted, r'UpdateVisitDto', 'isCompleted'),
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
            r'UpdateVisitDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
