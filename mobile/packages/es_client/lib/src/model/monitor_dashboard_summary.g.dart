// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'monitor_dashboard_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MonitorDashboardSummary extends MonitorDashboardSummary {
  @override
  final num totalSamples;
  @override
  final num processedSamples;
  @override
  final num positivityRate;
  @override
  final num? positiveSamples;
  @override
  final num? negativeSamples;
  @override
  final num positiveSites;
  @override
  final num inconclusiveSamples;

  factory _$MonitorDashboardSummary(
          [void Function(MonitorDashboardSummaryBuilder)? updates]) =>
      (MonitorDashboardSummaryBuilder()..update(updates))._build();

  _$MonitorDashboardSummary._(
      {required this.totalSamples,
      required this.processedSamples,
      required this.positivityRate,
      this.positiveSamples,
      this.negativeSamples,
      required this.positiveSites,
      required this.inconclusiveSamples})
      : super._();
  @override
  MonitorDashboardSummary rebuild(
          void Function(MonitorDashboardSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MonitorDashboardSummaryBuilder toBuilder() =>
      MonitorDashboardSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MonitorDashboardSummary &&
        totalSamples == other.totalSamples &&
        processedSamples == other.processedSamples &&
        positivityRate == other.positivityRate &&
        positiveSamples == other.positiveSamples &&
        negativeSamples == other.negativeSamples &&
        positiveSites == other.positiveSites &&
        inconclusiveSamples == other.inconclusiveSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalSamples.hashCode);
    _$hash = $jc(_$hash, processedSamples.hashCode);
    _$hash = $jc(_$hash, positivityRate.hashCode);
    _$hash = $jc(_$hash, positiveSamples.hashCode);
    _$hash = $jc(_$hash, negativeSamples.hashCode);
    _$hash = $jc(_$hash, positiveSites.hashCode);
    _$hash = $jc(_$hash, inconclusiveSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MonitorDashboardSummary')
          ..add('totalSamples', totalSamples)
          ..add('processedSamples', processedSamples)
          ..add('positivityRate', positivityRate)
          ..add('positiveSamples', positiveSamples)
          ..add('negativeSamples', negativeSamples)
          ..add('positiveSites', positiveSites)
          ..add('inconclusiveSamples', inconclusiveSamples))
        .toString();
  }
}

class MonitorDashboardSummaryBuilder
    implements
        Builder<MonitorDashboardSummary, MonitorDashboardSummaryBuilder> {
  _$MonitorDashboardSummary? _$v;

  num? _totalSamples;
  num? get totalSamples => _$this._totalSamples;
  set totalSamples(num? totalSamples) => _$this._totalSamples = totalSamples;

  num? _processedSamples;
  num? get processedSamples => _$this._processedSamples;
  set processedSamples(num? processedSamples) =>
      _$this._processedSamples = processedSamples;

  num? _positivityRate;
  num? get positivityRate => _$this._positivityRate;
  set positivityRate(num? positivityRate) =>
      _$this._positivityRate = positivityRate;

  num? _positiveSamples;
  num? get positiveSamples => _$this._positiveSamples;
  set positiveSamples(num? positiveSamples) =>
      _$this._positiveSamples = positiveSamples;

  num? _negativeSamples;
  num? get negativeSamples => _$this._negativeSamples;
  set negativeSamples(num? negativeSamples) =>
      _$this._negativeSamples = negativeSamples;

  num? _positiveSites;
  num? get positiveSites => _$this._positiveSites;
  set positiveSites(num? positiveSites) =>
      _$this._positiveSites = positiveSites;

  num? _inconclusiveSamples;
  num? get inconclusiveSamples => _$this._inconclusiveSamples;
  set inconclusiveSamples(num? inconclusiveSamples) =>
      _$this._inconclusiveSamples = inconclusiveSamples;

  MonitorDashboardSummaryBuilder() {
    MonitorDashboardSummary._defaults(this);
  }

  MonitorDashboardSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalSamples = $v.totalSamples;
      _processedSamples = $v.processedSamples;
      _positivityRate = $v.positivityRate;
      _positiveSamples = $v.positiveSamples;
      _negativeSamples = $v.negativeSamples;
      _positiveSites = $v.positiveSites;
      _inconclusiveSamples = $v.inconclusiveSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MonitorDashboardSummary other) {
    _$v = other as _$MonitorDashboardSummary;
  }

  @override
  void update(void Function(MonitorDashboardSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MonitorDashboardSummary build() => _build();

  _$MonitorDashboardSummary _build() {
    final _$result = _$v ??
        _$MonitorDashboardSummary._(
          totalSamples: BuiltValueNullFieldError.checkNotNull(
              totalSamples, r'MonitorDashboardSummary', 'totalSamples'),
          processedSamples: BuiltValueNullFieldError.checkNotNull(
              processedSamples, r'MonitorDashboardSummary', 'processedSamples'),
          positivityRate: BuiltValueNullFieldError.checkNotNull(
              positivityRate, r'MonitorDashboardSummary', 'positivityRate'),
          positiveSamples: positiveSamples,
          negativeSamples: negativeSamples,
          positiveSites: BuiltValueNullFieldError.checkNotNull(
              positiveSites, r'MonitorDashboardSummary', 'positiveSites'),
          inconclusiveSamples: BuiltValueNullFieldError.checkNotNull(
              inconclusiveSamples,
              r'MonitorDashboardSummary',
              'inconclusiveSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
