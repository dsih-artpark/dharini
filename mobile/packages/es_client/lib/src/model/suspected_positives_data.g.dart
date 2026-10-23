// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'suspected_positives_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SuspectedPositivesData extends SuspectedPositivesData {
  @override
  final Disease? disease;
  @override
  final num? sampleCount;
  @override
  final bool? isSuspectedPositive;

  factory _$SuspectedPositivesData(
          [void Function(SuspectedPositivesDataBuilder)? updates]) =>
      (SuspectedPositivesDataBuilder()..update(updates))._build();

  _$SuspectedPositivesData._(
      {this.disease, this.sampleCount, this.isSuspectedPositive})
      : super._();
  @override
  SuspectedPositivesData rebuild(
          void Function(SuspectedPositivesDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SuspectedPositivesDataBuilder toBuilder() =>
      SuspectedPositivesDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SuspectedPositivesData &&
        disease == other.disease &&
        sampleCount == other.sampleCount &&
        isSuspectedPositive == other.isSuspectedPositive;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, sampleCount.hashCode);
    _$hash = $jc(_$hash, isSuspectedPositive.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SuspectedPositivesData')
          ..add('disease', disease)
          ..add('sampleCount', sampleCount)
          ..add('isSuspectedPositive', isSuspectedPositive))
        .toString();
  }
}

class SuspectedPositivesDataBuilder
    implements Builder<SuspectedPositivesData, SuspectedPositivesDataBuilder> {
  _$SuspectedPositivesData? _$v;

  DiseaseBuilder? _disease;
  DiseaseBuilder get disease => _$this._disease ??= DiseaseBuilder();
  set disease(DiseaseBuilder? disease) => _$this._disease = disease;

  num? _sampleCount;
  num? get sampleCount => _$this._sampleCount;
  set sampleCount(num? sampleCount) => _$this._sampleCount = sampleCount;

  bool? _isSuspectedPositive;
  bool? get isSuspectedPositive => _$this._isSuspectedPositive;
  set isSuspectedPositive(bool? isSuspectedPositive) =>
      _$this._isSuspectedPositive = isSuspectedPositive;

  SuspectedPositivesDataBuilder() {
    SuspectedPositivesData._defaults(this);
  }

  SuspectedPositivesDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _disease = $v.disease?.toBuilder();
      _sampleCount = $v.sampleCount;
      _isSuspectedPositive = $v.isSuspectedPositive;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SuspectedPositivesData other) {
    _$v = other as _$SuspectedPositivesData;
  }

  @override
  void update(void Function(SuspectedPositivesDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SuspectedPositivesData build() => _build();

  _$SuspectedPositivesData _build() {
    _$SuspectedPositivesData _$result;
    try {
      _$result = _$v ??
          _$SuspectedPositivesData._(
            disease: _disease?.build(),
            sampleCount: sampleCount,
            isSuspectedPositive: isSuspectedPositive,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'disease';
        _disease?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SuspectedPositivesData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
