// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_stat_logistic_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleStatLogisticResponseData extends SampleStatLogisticResponseData {
  @override
  final num totalCollected;
  @override
  final num totalUnclear;
  @override
  final num totalPositive;
  @override
  final num totalNegative;

  factory _$SampleStatLogisticResponseData(
          [void Function(SampleStatLogisticResponseDataBuilder)? updates]) =>
      (SampleStatLogisticResponseDataBuilder()..update(updates))._build();

  _$SampleStatLogisticResponseData._(
      {required this.totalCollected,
      required this.totalUnclear,
      required this.totalPositive,
      required this.totalNegative})
      : super._();
  @override
  SampleStatLogisticResponseData rebuild(
          void Function(SampleStatLogisticResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleStatLogisticResponseDataBuilder toBuilder() =>
      SampleStatLogisticResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleStatLogisticResponseData &&
        totalCollected == other.totalCollected &&
        totalUnclear == other.totalUnclear &&
        totalPositive == other.totalPositive &&
        totalNegative == other.totalNegative;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalCollected.hashCode);
    _$hash = $jc(_$hash, totalUnclear.hashCode);
    _$hash = $jc(_$hash, totalPositive.hashCode);
    _$hash = $jc(_$hash, totalNegative.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleStatLogisticResponseData')
          ..add('totalCollected', totalCollected)
          ..add('totalUnclear', totalUnclear)
          ..add('totalPositive', totalPositive)
          ..add('totalNegative', totalNegative))
        .toString();
  }
}

class SampleStatLogisticResponseDataBuilder
    implements
        Builder<SampleStatLogisticResponseData,
            SampleStatLogisticResponseDataBuilder> {
  _$SampleStatLogisticResponseData? _$v;

  num? _totalCollected;
  num? get totalCollected => _$this._totalCollected;
  set totalCollected(num? totalCollected) =>
      _$this._totalCollected = totalCollected;

  num? _totalUnclear;
  num? get totalUnclear => _$this._totalUnclear;
  set totalUnclear(num? totalUnclear) => _$this._totalUnclear = totalUnclear;

  num? _totalPositive;
  num? get totalPositive => _$this._totalPositive;
  set totalPositive(num? totalPositive) =>
      _$this._totalPositive = totalPositive;

  num? _totalNegative;
  num? get totalNegative => _$this._totalNegative;
  set totalNegative(num? totalNegative) =>
      _$this._totalNegative = totalNegative;

  SampleStatLogisticResponseDataBuilder() {
    SampleStatLogisticResponseData._defaults(this);
  }

  SampleStatLogisticResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalCollected = $v.totalCollected;
      _totalUnclear = $v.totalUnclear;
      _totalPositive = $v.totalPositive;
      _totalNegative = $v.totalNegative;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleStatLogisticResponseData other) {
    _$v = other as _$SampleStatLogisticResponseData;
  }

  @override
  void update(void Function(SampleStatLogisticResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleStatLogisticResponseData build() => _build();

  _$SampleStatLogisticResponseData _build() {
    final _$result = _$v ??
        _$SampleStatLogisticResponseData._(
          totalCollected: BuiltValueNullFieldError.checkNotNull(totalCollected,
              r'SampleStatLogisticResponseData', 'totalCollected'),
          totalUnclear: BuiltValueNullFieldError.checkNotNull(
              totalUnclear, r'SampleStatLogisticResponseData', 'totalUnclear'),
          totalPositive: BuiltValueNullFieldError.checkNotNull(totalPositive,
              r'SampleStatLogisticResponseData', 'totalPositive'),
          totalNegative: BuiltValueNullFieldError.checkNotNull(totalNegative,
              r'SampleStatLogisticResponseData', 'totalNegative'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
