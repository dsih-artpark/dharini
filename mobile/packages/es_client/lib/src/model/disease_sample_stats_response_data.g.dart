// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_sample_stats_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseSampleStatsResponseData extends DiseaseSampleStatsResponseData {
  @override
  final DiseaseSampleStatsType diseaseName;

  factory _$DiseaseSampleStatsResponseData(
          [void Function(DiseaseSampleStatsResponseDataBuilder)? updates]) =>
      (DiseaseSampleStatsResponseDataBuilder()..update(updates))._build();

  _$DiseaseSampleStatsResponseData._({required this.diseaseName}) : super._();
  @override
  DiseaseSampleStatsResponseData rebuild(
          void Function(DiseaseSampleStatsResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseSampleStatsResponseDataBuilder toBuilder() =>
      DiseaseSampleStatsResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseSampleStatsResponseData &&
        diseaseName == other.diseaseName;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, diseaseName.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'DiseaseSampleStatsResponseData')
          ..add('diseaseName', diseaseName))
        .toString();
  }
}

class DiseaseSampleStatsResponseDataBuilder
    implements
        Builder<DiseaseSampleStatsResponseData,
            DiseaseSampleStatsResponseDataBuilder> {
  _$DiseaseSampleStatsResponseData? _$v;

  DiseaseSampleStatsTypeBuilder? _diseaseName;
  DiseaseSampleStatsTypeBuilder get diseaseName =>
      _$this._diseaseName ??= DiseaseSampleStatsTypeBuilder();
  set diseaseName(DiseaseSampleStatsTypeBuilder? diseaseName) =>
      _$this._diseaseName = diseaseName;

  DiseaseSampleStatsResponseDataBuilder() {
    DiseaseSampleStatsResponseData._defaults(this);
  }

  DiseaseSampleStatsResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _diseaseName = $v.diseaseName.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(DiseaseSampleStatsResponseData other) {
    _$v = other as _$DiseaseSampleStatsResponseData;
  }

  @override
  void update(void Function(DiseaseSampleStatsResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseSampleStatsResponseData build() => _build();

  _$DiseaseSampleStatsResponseData _build() {
    _$DiseaseSampleStatsResponseData _$result;
    try {
      _$result = _$v ??
          _$DiseaseSampleStatsResponseData._(
            diseaseName: diseaseName.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseaseName';
        diseaseName.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseSampleStatsResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
