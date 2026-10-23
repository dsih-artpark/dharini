// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_sample_stats_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseSampleStatsType extends DiseaseSampleStatsType {
  @override
  final num totalSamples;
  @override
  final num testedSamples;

  factory _$DiseaseSampleStatsType(
          [void Function(DiseaseSampleStatsTypeBuilder)? updates]) =>
      (DiseaseSampleStatsTypeBuilder()..update(updates))._build();

  _$DiseaseSampleStatsType._(
      {required this.totalSamples, required this.testedSamples})
      : super._();
  @override
  DiseaseSampleStatsType rebuild(
          void Function(DiseaseSampleStatsTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseSampleStatsTypeBuilder toBuilder() =>
      DiseaseSampleStatsTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseSampleStatsType &&
        totalSamples == other.totalSamples &&
        testedSamples == other.testedSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalSamples.hashCode);
    _$hash = $jc(_$hash, testedSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseSampleStatsType')
          ..add('totalSamples', totalSamples)
          ..add('testedSamples', testedSamples))
        .toString();
  }
}

class DiseaseSampleStatsTypeBuilder
    implements Builder<DiseaseSampleStatsType, DiseaseSampleStatsTypeBuilder> {
  _$DiseaseSampleStatsType? _$v;

  num? _totalSamples;
  num? get totalSamples => _$this._totalSamples;
  set totalSamples(num? totalSamples) => _$this._totalSamples = totalSamples;

  num? _testedSamples;
  num? get testedSamples => _$this._testedSamples;
  set testedSamples(num? testedSamples) =>
      _$this._testedSamples = testedSamples;

  DiseaseSampleStatsTypeBuilder() {
    DiseaseSampleStatsType._defaults(this);
  }

  DiseaseSampleStatsTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalSamples = $v.totalSamples;
      _testedSamples = $v.testedSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseSampleStatsType other) {
    _$v = other as _$DiseaseSampleStatsType;
  }

  @override
  void update(void Function(DiseaseSampleStatsTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseSampleStatsType build() => _build();

  _$DiseaseSampleStatsType _build() {
    final _$result = _$v ??
        _$DiseaseSampleStatsType._(
          totalSamples: BuiltValueNullFieldError.checkNotNull(
              totalSamples, r'DiseaseSampleStatsType', 'totalSamples'),
          testedSamples: BuiltValueNullFieldError.checkNotNull(
              testedSamples, r'DiseaseSampleStatsType', 'testedSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
