// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_progress_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamProgressResponseData extends TeamProgressResponseData {
  @override
  final String id;
  @override
  final String name;
  @override
  final num pendingVisitCount;
  @override
  final num completedVisitCount;
  @override
  final num totalTeamMemberCount;
  @override
  final BuiltList<String>? photos;
  @override
  final String? farmType;
  @override
  final String? siteSubType;
  @override
  final String? siteType;
  @override
  final String? status;
  @override
  final TeamProgressResponseDataCollectionCollector? collectionCollector;

  factory _$TeamProgressResponseData(
          [void Function(TeamProgressResponseDataBuilder)? updates]) =>
      (TeamProgressResponseDataBuilder()..update(updates))._build();

  _$TeamProgressResponseData._(
      {required this.id,
      required this.name,
      required this.pendingVisitCount,
      required this.completedVisitCount,
      required this.totalTeamMemberCount,
      this.photos,
      this.farmType,
      this.siteSubType,
      this.siteType,
      this.status,
      this.collectionCollector})
      : super._();
  @override
  TeamProgressResponseData rebuild(
          void Function(TeamProgressResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamProgressResponseDataBuilder toBuilder() =>
      TeamProgressResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamProgressResponseData &&
        id == other.id &&
        name == other.name &&
        pendingVisitCount == other.pendingVisitCount &&
        completedVisitCount == other.completedVisitCount &&
        totalTeamMemberCount == other.totalTeamMemberCount &&
        photos == other.photos &&
        farmType == other.farmType &&
        siteSubType == other.siteSubType &&
        siteType == other.siteType &&
        status == other.status &&
        collectionCollector == other.collectionCollector;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, pendingVisitCount.hashCode);
    _$hash = $jc(_$hash, completedVisitCount.hashCode);
    _$hash = $jc(_$hash, totalTeamMemberCount.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, farmType.hashCode);
    _$hash = $jc(_$hash, siteSubType.hashCode);
    _$hash = $jc(_$hash, siteType.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, collectionCollector.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamProgressResponseData')
          ..add('id', id)
          ..add('name', name)
          ..add('pendingVisitCount', pendingVisitCount)
          ..add('completedVisitCount', completedVisitCount)
          ..add('totalTeamMemberCount', totalTeamMemberCount)
          ..add('photos', photos)
          ..add('farmType', farmType)
          ..add('siteSubType', siteSubType)
          ..add('siteType', siteType)
          ..add('status', status)
          ..add('collectionCollector', collectionCollector))
        .toString();
  }
}

class TeamProgressResponseDataBuilder
    implements
        Builder<TeamProgressResponseData, TeamProgressResponseDataBuilder> {
  _$TeamProgressResponseData? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  num? _pendingVisitCount;
  num? get pendingVisitCount => _$this._pendingVisitCount;
  set pendingVisitCount(num? pendingVisitCount) =>
      _$this._pendingVisitCount = pendingVisitCount;

  num? _completedVisitCount;
  num? get completedVisitCount => _$this._completedVisitCount;
  set completedVisitCount(num? completedVisitCount) =>
      _$this._completedVisitCount = completedVisitCount;

  num? _totalTeamMemberCount;
  num? get totalTeamMemberCount => _$this._totalTeamMemberCount;
  set totalTeamMemberCount(num? totalTeamMemberCount) =>
      _$this._totalTeamMemberCount = totalTeamMemberCount;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _farmType;
  String? get farmType => _$this._farmType;
  set farmType(String? farmType) => _$this._farmType = farmType;

  String? _siteSubType;
  String? get siteSubType => _$this._siteSubType;
  set siteSubType(String? siteSubType) => _$this._siteSubType = siteSubType;

  String? _siteType;
  String? get siteType => _$this._siteType;
  set siteType(String? siteType) => _$this._siteType = siteType;

  String? _status;
  String? get status => _$this._status;
  set status(String? status) => _$this._status = status;

  TeamProgressResponseDataCollectionCollectorBuilder? _collectionCollector;
  TeamProgressResponseDataCollectionCollectorBuilder get collectionCollector =>
      _$this._collectionCollector ??=
          TeamProgressResponseDataCollectionCollectorBuilder();
  set collectionCollector(
          TeamProgressResponseDataCollectionCollectorBuilder?
              collectionCollector) =>
      _$this._collectionCollector = collectionCollector;

  TeamProgressResponseDataBuilder() {
    TeamProgressResponseData._defaults(this);
  }

  TeamProgressResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _name = $v.name;
      _pendingVisitCount = $v.pendingVisitCount;
      _completedVisitCount = $v.completedVisitCount;
      _totalTeamMemberCount = $v.totalTeamMemberCount;
      _photos = $v.photos?.toBuilder();
      _farmType = $v.farmType;
      _siteSubType = $v.siteSubType;
      _siteType = $v.siteType;
      _status = $v.status;
      _collectionCollector = $v.collectionCollector?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamProgressResponseData other) {
    _$v = other as _$TeamProgressResponseData;
  }

  @override
  void update(void Function(TeamProgressResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamProgressResponseData build() => _build();

  _$TeamProgressResponseData _build() {
    _$TeamProgressResponseData _$result;
    try {
      _$result = _$v ??
          _$TeamProgressResponseData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'TeamProgressResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'TeamProgressResponseData', 'name'),
            pendingVisitCount: BuiltValueNullFieldError.checkNotNull(
                pendingVisitCount,
                r'TeamProgressResponseData',
                'pendingVisitCount'),
            completedVisitCount: BuiltValueNullFieldError.checkNotNull(
                completedVisitCount,
                r'TeamProgressResponseData',
                'completedVisitCount'),
            totalTeamMemberCount: BuiltValueNullFieldError.checkNotNull(
                totalTeamMemberCount,
                r'TeamProgressResponseData',
                'totalTeamMemberCount'),
            photos: _photos?.build(),
            farmType: farmType,
            siteSubType: siteSubType,
            siteType: siteType,
            status: status,
            collectionCollector: _collectionCollector?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        _photos?.build();

        _$failedField = 'collectionCollector';
        _collectionCollector?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamProgressResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
