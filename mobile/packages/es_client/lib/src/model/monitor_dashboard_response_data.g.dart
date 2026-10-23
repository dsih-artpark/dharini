// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'monitor_dashboard_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MonitorDashboardResponseData extends MonitorDashboardResponseData {
  @override
  final MonitorDashboardSummary summary;
  @override
  final BuiltList<MonitorDashboardTrendPoint> trend;
  @override
  final BuiltList<MonitorDashboardDiseasePositive> diseasePositive;

  factory _$MonitorDashboardResponseData(
          [void Function(MonitorDashboardResponseDataBuilder)? updates]) =>
      (MonitorDashboardResponseDataBuilder()..update(updates))._build();

  _$MonitorDashboardResponseData._(
      {required this.summary,
      required this.trend,
      required this.diseasePositive})
      : super._();
  @override
  MonitorDashboardResponseData rebuild(
          void Function(MonitorDashboardResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MonitorDashboardResponseDataBuilder toBuilder() =>
      MonitorDashboardResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MonitorDashboardResponseData &&
        summary == other.summary &&
        trend == other.trend &&
        diseasePositive == other.diseasePositive;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, summary.hashCode);
    _$hash = $jc(_$hash, trend.hashCode);
    _$hash = $jc(_$hash, diseasePositive.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MonitorDashboardResponseData')
          ..add('summary', summary)
          ..add('trend', trend)
          ..add('diseasePositive', diseasePositive))
        .toString();
  }
}

class MonitorDashboardResponseDataBuilder
    implements
        Builder<MonitorDashboardResponseData,
            MonitorDashboardResponseDataBuilder> {
  _$MonitorDashboardResponseData? _$v;

  MonitorDashboardSummaryBuilder? _summary;
  MonitorDashboardSummaryBuilder get summary =>
      _$this._summary ??= MonitorDashboardSummaryBuilder();
  set summary(MonitorDashboardSummaryBuilder? summary) =>
      _$this._summary = summary;

  ListBuilder<MonitorDashboardTrendPoint>? _trend;
  ListBuilder<MonitorDashboardTrendPoint> get trend =>
      _$this._trend ??= ListBuilder<MonitorDashboardTrendPoint>();
  set trend(ListBuilder<MonitorDashboardTrendPoint>? trend) =>
      _$this._trend = trend;

  ListBuilder<MonitorDashboardDiseasePositive>? _diseasePositive;
  ListBuilder<MonitorDashboardDiseasePositive> get diseasePositive =>
      _$this._diseasePositive ??=
          ListBuilder<MonitorDashboardDiseasePositive>();
  set diseasePositive(
          ListBuilder<MonitorDashboardDiseasePositive>? diseasePositive) =>
      _$this._diseasePositive = diseasePositive;

  MonitorDashboardResponseDataBuilder() {
    MonitorDashboardResponseData._defaults(this);
  }

  MonitorDashboardResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _summary = $v.summary.toBuilder();
      _trend = $v.trend.toBuilder();
      _diseasePositive = $v.diseasePositive.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MonitorDashboardResponseData other) {
    _$v = other as _$MonitorDashboardResponseData;
  }

  @override
  void update(void Function(MonitorDashboardResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MonitorDashboardResponseData build() => _build();

  _$MonitorDashboardResponseData _build() {
    _$MonitorDashboardResponseData _$result;
    try {
      _$result = _$v ??
          _$MonitorDashboardResponseData._(
            summary: summary.build(),
            trend: trend.build(),
            diseasePositive: diseasePositive.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'summary';
        summary.build();
        _$failedField = 'trend';
        trend.build();
        _$failedField = 'diseasePositive';
        diseasePositive.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MonitorDashboardResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
