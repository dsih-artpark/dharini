// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'monitor_dashboard_disease_positive.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MonitorDashboardDiseasePositive
    extends MonitorDashboardDiseasePositive {
  @override
  final String diseaseId;
  @override
  final String diseaseName;
  @override
  final String diseaseShortName;
  @override
  final num diseaseIndex;
  @override
  final num positiveSamples;

  factory _$MonitorDashboardDiseasePositive(
          [void Function(MonitorDashboardDiseasePositiveBuilder)? updates]) =>
      (MonitorDashboardDiseasePositiveBuilder()..update(updates))._build();

  _$MonitorDashboardDiseasePositive._(
      {required this.diseaseId,
      required this.diseaseName,
      required this.diseaseShortName,
      required this.diseaseIndex,
      required this.positiveSamples})
      : super._();
  @override
  MonitorDashboardDiseasePositive rebuild(
          void Function(MonitorDashboardDiseasePositiveBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MonitorDashboardDiseasePositiveBuilder toBuilder() =>
      MonitorDashboardDiseasePositiveBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MonitorDashboardDiseasePositive &&
        diseaseId == other.diseaseId &&
        diseaseName == other.diseaseName &&
        diseaseShortName == other.diseaseShortName &&
        diseaseIndex == other.diseaseIndex &&
        positiveSamples == other.positiveSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseaseId.hashCode);
    _$hash = $jc(_$hash, diseaseName.hashCode);
    _$hash = $jc(_$hash, diseaseShortName.hashCode);
    _$hash = $jc(_$hash, diseaseIndex.hashCode);
    _$hash = $jc(_$hash, positiveSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MonitorDashboardDiseasePositive')
          ..add('diseaseId', diseaseId)
          ..add('diseaseName', diseaseName)
          ..add('diseaseShortName', diseaseShortName)
          ..add('diseaseIndex', diseaseIndex)
          ..add('positiveSamples', positiveSamples))
        .toString();
  }
}

class MonitorDashboardDiseasePositiveBuilder
    implements
        Builder<MonitorDashboardDiseasePositive,
            MonitorDashboardDiseasePositiveBuilder> {
  _$MonitorDashboardDiseasePositive? _$v;

  String? _diseaseId;
  String? get diseaseId => _$this._diseaseId;
  set diseaseId(String? diseaseId) => _$this._diseaseId = diseaseId;

  String? _diseaseName;
  String? get diseaseName => _$this._diseaseName;
  set diseaseName(String? diseaseName) => _$this._diseaseName = diseaseName;

  String? _diseaseShortName;
  String? get diseaseShortName => _$this._diseaseShortName;
  set diseaseShortName(String? diseaseShortName) =>
      _$this._diseaseShortName = diseaseShortName;

  num? _diseaseIndex;
  num? get diseaseIndex => _$this._diseaseIndex;
  set diseaseIndex(num? diseaseIndex) => _$this._diseaseIndex = diseaseIndex;

  num? _positiveSamples;
  num? get positiveSamples => _$this._positiveSamples;
  set positiveSamples(num? positiveSamples) =>
      _$this._positiveSamples = positiveSamples;

  MonitorDashboardDiseasePositiveBuilder() {
    MonitorDashboardDiseasePositive._defaults(this);
  }

  MonitorDashboardDiseasePositiveBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseaseId = $v.diseaseId;
      _diseaseName = $v.diseaseName;
      _diseaseShortName = $v.diseaseShortName;
      _diseaseIndex = $v.diseaseIndex;
      _positiveSamples = $v.positiveSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MonitorDashboardDiseasePositive other) {
    _$v = other as _$MonitorDashboardDiseasePositive;
  }

  @override
  void update(void Function(MonitorDashboardDiseasePositiveBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MonitorDashboardDiseasePositive build() => _build();

  _$MonitorDashboardDiseasePositive _build() {
    final _$result = _$v ??
        _$MonitorDashboardDiseasePositive._(
          diseaseId: BuiltValueNullFieldError.checkNotNull(
              diseaseId, r'MonitorDashboardDiseasePositive', 'diseaseId'),
          diseaseName: BuiltValueNullFieldError.checkNotNull(
              diseaseName, r'MonitorDashboardDiseasePositive', 'diseaseName'),
          diseaseShortName: BuiltValueNullFieldError.checkNotNull(
              diseaseShortName,
              r'MonitorDashboardDiseasePositive',
              'diseaseShortName'),
          diseaseIndex: BuiltValueNullFieldError.checkNotNull(
              diseaseIndex, r'MonitorDashboardDiseasePositive', 'diseaseIndex'),
          positiveSamples: BuiltValueNullFieldError.checkNotNull(
              positiveSamples,
              r'MonitorDashboardDiseasePositive',
              'positiveSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
