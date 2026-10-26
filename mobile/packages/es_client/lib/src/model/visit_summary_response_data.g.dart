// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_summary_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitSummaryResponseData extends VisitSummaryResponseData {
  @override
  final num visitCount;
  @override
  final num totalSampleCollected;
  @override
  final num pendingVisitsIndividual;
  @override
  final num overdueVisits;
  @override
  final num pendingVisits;
  @override
  final num completedVisits;

  factory _$VisitSummaryResponseData(
          [void Function(VisitSummaryResponseDataBuilder)? updates]) =>
      (VisitSummaryResponseDataBuilder()..update(updates))._build();

  _$VisitSummaryResponseData._(
      {required this.visitCount,
      required this.totalSampleCollected,
      required this.pendingVisitsIndividual,
      required this.overdueVisits,
      required this.pendingVisits,
      required this.completedVisits})
      : super._();
  @override
  VisitSummaryResponseData rebuild(
          void Function(VisitSummaryResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitSummaryResponseDataBuilder toBuilder() =>
      VisitSummaryResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitSummaryResponseData &&
        visitCount == other.visitCount &&
        totalSampleCollected == other.totalSampleCollected &&
        pendingVisitsIndividual == other.pendingVisitsIndividual &&
        overdueVisits == other.overdueVisits &&
        pendingVisits == other.pendingVisits &&
        completedVisits == other.completedVisits;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitCount.hashCode);
    _$hash = $jc(_$hash, totalSampleCollected.hashCode);
    _$hash = $jc(_$hash, pendingVisitsIndividual.hashCode);
    _$hash = $jc(_$hash, overdueVisits.hashCode);
    _$hash = $jc(_$hash, pendingVisits.hashCode);
    _$hash = $jc(_$hash, completedVisits.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VisitSummaryResponseData')
          ..add('visitCount', visitCount)
          ..add('totalSampleCollected', totalSampleCollected)
          ..add('pendingVisitsIndividual', pendingVisitsIndividual)
          ..add('overdueVisits', overdueVisits)
          ..add('pendingVisits', pendingVisits)
          ..add('completedVisits', completedVisits))
        .toString();
  }
}

class VisitSummaryResponseDataBuilder
    implements
        Builder<VisitSummaryResponseData, VisitSummaryResponseDataBuilder> {
  _$VisitSummaryResponseData? _$v;

  num? _visitCount;
  num? get visitCount => _$this._visitCount;
  set visitCount(num? visitCount) => _$this._visitCount = visitCount;

  num? _totalSampleCollected;
  num? get totalSampleCollected => _$this._totalSampleCollected;
  set totalSampleCollected(num? totalSampleCollected) =>
      _$this._totalSampleCollected = totalSampleCollected;

  num? _pendingVisitsIndividual;
  num? get pendingVisitsIndividual => _$this._pendingVisitsIndividual;
  set pendingVisitsIndividual(num? pendingVisitsIndividual) =>
      _$this._pendingVisitsIndividual = pendingVisitsIndividual;

  num? _overdueVisits;
  num? get overdueVisits => _$this._overdueVisits;
  set overdueVisits(num? overdueVisits) =>
      _$this._overdueVisits = overdueVisits;

  num? _pendingVisits;
  num? get pendingVisits => _$this._pendingVisits;
  set pendingVisits(num? pendingVisits) =>
      _$this._pendingVisits = pendingVisits;

  num? _completedVisits;
  num? get completedVisits => _$this._completedVisits;
  set completedVisits(num? completedVisits) =>
      _$this._completedVisits = completedVisits;

  VisitSummaryResponseDataBuilder() {
    VisitSummaryResponseData._defaults(this);
  }

  VisitSummaryResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitCount = $v.visitCount;
      _totalSampleCollected = $v.totalSampleCollected;
      _pendingVisitsIndividual = $v.pendingVisitsIndividual;
      _overdueVisits = $v.overdueVisits;
      _pendingVisits = $v.pendingVisits;
      _completedVisits = $v.completedVisits;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VisitSummaryResponseData other) {
    _$v = other as _$VisitSummaryResponseData;
  }

  @override
  void update(void Function(VisitSummaryResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitSummaryResponseData build() => _build();

  _$VisitSummaryResponseData _build() {
    final _$result = _$v ??
        _$VisitSummaryResponseData._(
          visitCount: BuiltValueNullFieldError.checkNotNull(
              visitCount, r'VisitSummaryResponseData', 'visitCount'),
          totalSampleCollected: BuiltValueNullFieldError.checkNotNull(
              totalSampleCollected,
              r'VisitSummaryResponseData',
              'totalSampleCollected'),
          pendingVisitsIndividual: BuiltValueNullFieldError.checkNotNull(
              pendingVisitsIndividual,
              r'VisitSummaryResponseData',
              'pendingVisitsIndividual'),
          overdueVisits: BuiltValueNullFieldError.checkNotNull(
              overdueVisits, r'VisitSummaryResponseData', 'overdueVisits'),
          pendingVisits: BuiltValueNullFieldError.checkNotNull(
              pendingVisits, r'VisitSummaryResponseData', 'pendingVisits'),
          completedVisits: BuiltValueNullFieldError.checkNotNull(
              completedVisits, r'VisitSummaryResponseData', 'completedVisits'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
