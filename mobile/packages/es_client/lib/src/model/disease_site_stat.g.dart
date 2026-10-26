// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_site_stat.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseSiteStat extends DiseaseSiteStat {
  @override
  final String diseaseId;
  @override
  final String diseaseName;
  @override
  final num? diseaseIndex;
  @override
  final String shortName;
  @override
  final num totalSites;
  @override
  final num positiveSites;
  @override
  final num negativeSites;
  @override
  final BuiltList<JsonObject> positiveSitesCoordinates;
  @override
  final BuiltList<JsonObject> negativeSitesCoordinates;

  factory _$DiseaseSiteStat([void Function(DiseaseSiteStatBuilder)? updates]) =>
      (DiseaseSiteStatBuilder()..update(updates))._build();

  _$DiseaseSiteStat._(
      {required this.diseaseId,
      required this.diseaseName,
      this.diseaseIndex,
      required this.shortName,
      required this.totalSites,
      required this.positiveSites,
      required this.negativeSites,
      required this.positiveSitesCoordinates,
      required this.negativeSitesCoordinates})
      : super._();
  @override
  DiseaseSiteStat rebuild(void Function(DiseaseSiteStatBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseSiteStatBuilder toBuilder() => DiseaseSiteStatBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseSiteStat &&
        diseaseId == other.diseaseId &&
        diseaseName == other.diseaseName &&
        diseaseIndex == other.diseaseIndex &&
        shortName == other.shortName &&
        totalSites == other.totalSites &&
        positiveSites == other.positiveSites &&
        negativeSites == other.negativeSites &&
        positiveSitesCoordinates == other.positiveSitesCoordinates &&
        negativeSitesCoordinates == other.negativeSitesCoordinates;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseaseId.hashCode);
    _$hash = $jc(_$hash, diseaseName.hashCode);
    _$hash = $jc(_$hash, diseaseIndex.hashCode);
    _$hash = $jc(_$hash, shortName.hashCode);
    _$hash = $jc(_$hash, totalSites.hashCode);
    _$hash = $jc(_$hash, positiveSites.hashCode);
    _$hash = $jc(_$hash, negativeSites.hashCode);
    _$hash = $jc(_$hash, positiveSitesCoordinates.hashCode);
    _$hash = $jc(_$hash, negativeSitesCoordinates.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseSiteStat')
          ..add('diseaseId', diseaseId)
          ..add('diseaseName', diseaseName)
          ..add('diseaseIndex', diseaseIndex)
          ..add('shortName', shortName)
          ..add('totalSites', totalSites)
          ..add('positiveSites', positiveSites)
          ..add('negativeSites', negativeSites)
          ..add('positiveSitesCoordinates', positiveSitesCoordinates)
          ..add('negativeSitesCoordinates', negativeSitesCoordinates))
        .toString();
  }
}

class DiseaseSiteStatBuilder
    implements Builder<DiseaseSiteStat, DiseaseSiteStatBuilder> {
  _$DiseaseSiteStat? _$v;

  String? _diseaseId;
  String? get diseaseId => _$this._diseaseId;
  set diseaseId(String? diseaseId) => _$this._diseaseId = diseaseId;

  String? _diseaseName;
  String? get diseaseName => _$this._diseaseName;
  set diseaseName(String? diseaseName) => _$this._diseaseName = diseaseName;

  num? _diseaseIndex;
  num? get diseaseIndex => _$this._diseaseIndex;
  set diseaseIndex(num? diseaseIndex) => _$this._diseaseIndex = diseaseIndex;

  String? _shortName;
  String? get shortName => _$this._shortName;
  set shortName(String? shortName) => _$this._shortName = shortName;

  num? _totalSites;
  num? get totalSites => _$this._totalSites;
  set totalSites(num? totalSites) => _$this._totalSites = totalSites;

  num? _positiveSites;
  num? get positiveSites => _$this._positiveSites;
  set positiveSites(num? positiveSites) =>
      _$this._positiveSites = positiveSites;

  num? _negativeSites;
  num? get negativeSites => _$this._negativeSites;
  set negativeSites(num? negativeSites) =>
      _$this._negativeSites = negativeSites;

  ListBuilder<JsonObject>? _positiveSitesCoordinates;
  ListBuilder<JsonObject> get positiveSitesCoordinates =>
      _$this._positiveSitesCoordinates ??= ListBuilder<JsonObject>();
  set positiveSitesCoordinates(
          ListBuilder<JsonObject>? positiveSitesCoordinates) =>
      _$this._positiveSitesCoordinates = positiveSitesCoordinates;

  ListBuilder<JsonObject>? _negativeSitesCoordinates;
  ListBuilder<JsonObject> get negativeSitesCoordinates =>
      _$this._negativeSitesCoordinates ??= ListBuilder<JsonObject>();
  set negativeSitesCoordinates(
          ListBuilder<JsonObject>? negativeSitesCoordinates) =>
      _$this._negativeSitesCoordinates = negativeSitesCoordinates;

  DiseaseSiteStatBuilder() {
    DiseaseSiteStat._defaults(this);
  }

  DiseaseSiteStatBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseaseId = $v.diseaseId;
      _diseaseName = $v.diseaseName;
      _diseaseIndex = $v.diseaseIndex;
      _shortName = $v.shortName;
      _totalSites = $v.totalSites;
      _positiveSites = $v.positiveSites;
      _negativeSites = $v.negativeSites;
      _positiveSitesCoordinates = $v.positiveSitesCoordinates.toBuilder();
      _negativeSitesCoordinates = $v.negativeSitesCoordinates.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseSiteStat other) {
    _$v = other as _$DiseaseSiteStat;
  }

  @override
  void update(void Function(DiseaseSiteStatBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseSiteStat build() => _build();

  _$DiseaseSiteStat _build() {
    _$DiseaseSiteStat _$result;
    try {
      _$result = _$v ??
          _$DiseaseSiteStat._(
            diseaseId: BuiltValueNullFieldError.checkNotNull(
                diseaseId, r'DiseaseSiteStat', 'diseaseId'),
            diseaseName: BuiltValueNullFieldError.checkNotNull(
                diseaseName, r'DiseaseSiteStat', 'diseaseName'),
            diseaseIndex: diseaseIndex,
            shortName: BuiltValueNullFieldError.checkNotNull(
                shortName, r'DiseaseSiteStat', 'shortName'),
            totalSites: BuiltValueNullFieldError.checkNotNull(
                totalSites, r'DiseaseSiteStat', 'totalSites'),
            positiveSites: BuiltValueNullFieldError.checkNotNull(
                positiveSites, r'DiseaseSiteStat', 'positiveSites'),
            negativeSites: BuiltValueNullFieldError.checkNotNull(
                negativeSites, r'DiseaseSiteStat', 'negativeSites'),
            positiveSitesCoordinates: positiveSitesCoordinates.build(),
            negativeSitesCoordinates: negativeSitesCoordinates.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'positiveSitesCoordinates';
        positiveSitesCoordinates.build();
        _$failedField = 'negativeSitesCoordinates';
        negativeSitesCoordinates.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseSiteStat', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
