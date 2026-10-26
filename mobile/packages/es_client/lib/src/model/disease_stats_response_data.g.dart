// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_stats_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseStatsResponseData extends DiseaseStatsResponseData {
  @override
  final DiseaseSampleStatsResponseData diseaseStats;

  factory _$DiseaseStatsResponseData(
          [void Function(DiseaseStatsResponseDataBuilder)? updates]) =>
      (DiseaseStatsResponseDataBuilder()..update(updates))._build();

  _$DiseaseStatsResponseData._({required this.diseaseStats}) : super._();
  @override
  DiseaseStatsResponseData rebuild(
          void Function(DiseaseStatsResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseStatsResponseDataBuilder toBuilder() =>
      DiseaseStatsResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseStatsResponseData &&
        diseaseStats == other.diseaseStats;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseaseStats.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseStatsResponseData')
          ..add('diseaseStats', diseaseStats))
        .toString();
  }
}

class DiseaseStatsResponseDataBuilder
    implements
        Builder<DiseaseStatsResponseData, DiseaseStatsResponseDataBuilder> {
  _$DiseaseStatsResponseData? _$v;

  DiseaseSampleStatsResponseDataBuilder? _diseaseStats;
  DiseaseSampleStatsResponseDataBuilder get diseaseStats =>
      _$this._diseaseStats ??= DiseaseSampleStatsResponseDataBuilder();
  set diseaseStats(DiseaseSampleStatsResponseDataBuilder? diseaseStats) =>
      _$this._diseaseStats = diseaseStats;

  DiseaseStatsResponseDataBuilder() {
    DiseaseStatsResponseData._defaults(this);
  }

  DiseaseStatsResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseaseStats = $v.diseaseStats.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseStatsResponseData other) {
    _$v = other as _$DiseaseStatsResponseData;
  }

  @override
  void update(void Function(DiseaseStatsResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseStatsResponseData build() => _build();

  _$DiseaseStatsResponseData _build() {
    _$DiseaseStatsResponseData _$result;
    try {
      _$result = _$v ??
          _$DiseaseStatsResponseData._(
            diseaseStats: diseaseStats.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseStats';
        diseaseStats.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseStatsResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
