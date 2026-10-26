// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_statistics.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseStatistics extends DiseaseStatistics {
  @override
  final String diseaseShortName;
  @override
  final num totalSamples;
  @override
  final num positiveSamples;

  factory _$DiseaseStatistics(
          [void Function(DiseaseStatisticsBuilder)? updates]) =>
      (DiseaseStatisticsBuilder()..update(updates))._build();

  _$DiseaseStatistics._(
      {required this.diseaseShortName,
      required this.totalSamples,
      required this.positiveSamples})
      : super._();
  @override
  DiseaseStatistics rebuild(void Function(DiseaseStatisticsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseStatisticsBuilder toBuilder() =>
      DiseaseStatisticsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseStatistics &&
        diseaseShortName == other.diseaseShortName &&
        totalSamples == other.totalSamples &&
        positiveSamples == other.positiveSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseaseShortName.hashCode);
    _$hash = $jc(_$hash, totalSamples.hashCode);
    _$hash = $jc(_$hash, positiveSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseStatistics')
          ..add('diseaseShortName', diseaseShortName)
          ..add('totalSamples', totalSamples)
          ..add('positiveSamples', positiveSamples))
        .toString();
  }
}

class DiseaseStatisticsBuilder
    implements Builder<DiseaseStatistics, DiseaseStatisticsBuilder> {
  _$DiseaseStatistics? _$v;

  String? _diseaseShortName;
  String? get diseaseShortName => _$this._diseaseShortName;
  set diseaseShortName(String? diseaseShortName) =>
      _$this._diseaseShortName = diseaseShortName;

  num? _totalSamples;
  num? get totalSamples => _$this._totalSamples;
  set totalSamples(num? totalSamples) => _$this._totalSamples = totalSamples;

  num? _positiveSamples;
  num? get positiveSamples => _$this._positiveSamples;
  set positiveSamples(num? positiveSamples) =>
      _$this._positiveSamples = positiveSamples;

  DiseaseStatisticsBuilder() {
    DiseaseStatistics._defaults(this);
  }

  DiseaseStatisticsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseaseShortName = $v.diseaseShortName;
      _totalSamples = $v.totalSamples;
      _positiveSamples = $v.positiveSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseStatistics other) {
    _$v = other as _$DiseaseStatistics;
  }

  @override
  void update(void Function(DiseaseStatisticsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseStatistics build() => _build();

  _$DiseaseStatistics _build() {
    final _$result = _$v ??
        _$DiseaseStatistics._(
          diseaseShortName: BuiltValueNullFieldError.checkNotNull(
              diseaseShortName, r'DiseaseStatistics', 'diseaseShortName'),
          totalSamples: BuiltValueNullFieldError.checkNotNull(
              totalSamples, r'DiseaseStatistics', 'totalSamples'),
          positiveSamples: BuiltValueNullFieldError.checkNotNull(
              positiveSamples, r'DiseaseStatistics', 'positiveSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
