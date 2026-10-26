// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'monitor_dashboard_trend_point.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MonitorDashboardTrendPoint extends MonitorDashboardTrendPoint {
  @override
  final DateTime period;
  @override
  final num totalSamples;
  @override
  final num positiveSamples;
  @override
  final num negativeSamples;

  factory _$MonitorDashboardTrendPoint(
          [void Function(MonitorDashboardTrendPointBuilder)? updates]) =>
      (MonitorDashboardTrendPointBuilder()..update(updates))._build();

  _$MonitorDashboardTrendPoint._(
      {required this.period,
      required this.totalSamples,
      required this.positiveSamples,
      required this.negativeSamples})
      : super._();
  @override
  MonitorDashboardTrendPoint rebuild(
          void Function(MonitorDashboardTrendPointBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MonitorDashboardTrendPointBuilder toBuilder() =>
      MonitorDashboardTrendPointBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MonitorDashboardTrendPoint &&
        period == other.period &&
        totalSamples == other.totalSamples &&
        positiveSamples == other.positiveSamples &&
        negativeSamples == other.negativeSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, period.hashCode);
    _$hash = $jc(_$hash, totalSamples.hashCode);
    _$hash = $jc(_$hash, positiveSamples.hashCode);
    _$hash = $jc(_$hash, negativeSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MonitorDashboardTrendPoint')
          ..add('period', period)
          ..add('totalSamples', totalSamples)
          ..add('positiveSamples', positiveSamples)
          ..add('negativeSamples', negativeSamples))
        .toString();
  }
}

class MonitorDashboardTrendPointBuilder
    implements
        Builder<MonitorDashboardTrendPoint, MonitorDashboardTrendPointBuilder> {
  _$MonitorDashboardTrendPoint? _$v;

  DateTime? _period;
  DateTime? get period => _$this._period;
  set period(DateTime? period) => _$this._period = period;

  num? _totalSamples;
  num? get totalSamples => _$this._totalSamples;
  set totalSamples(num? totalSamples) => _$this._totalSamples = totalSamples;

  num? _positiveSamples;
  num? get positiveSamples => _$this._positiveSamples;
  set positiveSamples(num? positiveSamples) =>
      _$this._positiveSamples = positiveSamples;

  num? _negativeSamples;
  num? get negativeSamples => _$this._negativeSamples;
  set negativeSamples(num? negativeSamples) =>
      _$this._negativeSamples = negativeSamples;

  MonitorDashboardTrendPointBuilder() {
    MonitorDashboardTrendPoint._defaults(this);
  }

  MonitorDashboardTrendPointBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _period = $v.period;
      _totalSamples = $v.totalSamples;
      _positiveSamples = $v.positiveSamples;
      _negativeSamples = $v.negativeSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MonitorDashboardTrendPoint other) {
    _$v = other as _$MonitorDashboardTrendPoint;
  }

  @override
  void update(void Function(MonitorDashboardTrendPointBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MonitorDashboardTrendPoint build() => _build();

  _$MonitorDashboardTrendPoint _build() {
    final _$result = _$v ??
        _$MonitorDashboardTrendPoint._(
          period: BuiltValueNullFieldError.checkNotNull(
              period, r'MonitorDashboardTrendPoint', 'period'),
          totalSamples: BuiltValueNullFieldError.checkNotNull(
              totalSamples, r'MonitorDashboardTrendPoint', 'totalSamples'),
          positiveSamples: BuiltValueNullFieldError.checkNotNull(
              positiveSamples,
              r'MonitorDashboardTrendPoint',
              'positiveSamples'),
          negativeSamples: BuiltValueNullFieldError.checkNotNull(
              negativeSamples,
              r'MonitorDashboardTrendPoint',
              'negativeSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
