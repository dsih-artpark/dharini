// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_activity_progress_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamActivityProgressResponseData
    extends TeamActivityProgressResponseData {
  @override
  final num totalPendingSampleCount;
  @override
  final num totalCompletedSampleCount;

  factory _$TeamActivityProgressResponseData(
          [void Function(TeamActivityProgressResponseDataBuilder)? updates]) =>
      (TeamActivityProgressResponseDataBuilder()..update(updates))._build();

  _$TeamActivityProgressResponseData._(
      {required this.totalPendingSampleCount,
      required this.totalCompletedSampleCount})
      : super._();
  @override
  TeamActivityProgressResponseData rebuild(
          void Function(TeamActivityProgressResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamActivityProgressResponseDataBuilder toBuilder() =>
      TeamActivityProgressResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamActivityProgressResponseData &&
        totalPendingSampleCount == other.totalPendingSampleCount &&
        totalCompletedSampleCount == other.totalCompletedSampleCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalPendingSampleCount.hashCode);
    _$hash = $jc(_$hash, totalCompletedSampleCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamActivityProgressResponseData')
          ..add('totalPendingSampleCount', totalPendingSampleCount)
          ..add('totalCompletedSampleCount', totalCompletedSampleCount))
        .toString();
  }
}

class TeamActivityProgressResponseDataBuilder
    implements
        Builder<TeamActivityProgressResponseData,
            TeamActivityProgressResponseDataBuilder> {
  _$TeamActivityProgressResponseData? _$v;

  num? _totalPendingSampleCount;
  num? get totalPendingSampleCount => _$this._totalPendingSampleCount;
  set totalPendingSampleCount(num? totalPendingSampleCount) =>
      _$this._totalPendingSampleCount = totalPendingSampleCount;

  num? _totalCompletedSampleCount;
  num? get totalCompletedSampleCount => _$this._totalCompletedSampleCount;
  set totalCompletedSampleCount(num? totalCompletedSampleCount) =>
      _$this._totalCompletedSampleCount = totalCompletedSampleCount;

  TeamActivityProgressResponseDataBuilder() {
    TeamActivityProgressResponseData._defaults(this);
  }

  TeamActivityProgressResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalPendingSampleCount = $v.totalPendingSampleCount;
      _totalCompletedSampleCount = $v.totalCompletedSampleCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamActivityProgressResponseData other) {
    _$v = other as _$TeamActivityProgressResponseData;
  }

  @override
  void update(void Function(TeamActivityProgressResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamActivityProgressResponseData build() => _build();

  _$TeamActivityProgressResponseData _build() {
    final _$result = _$v ??
        _$TeamActivityProgressResponseData._(
          totalPendingSampleCount: BuiltValueNullFieldError.checkNotNull(
              totalPendingSampleCount,
              r'TeamActivityProgressResponseData',
              'totalPendingSampleCount'),
          totalCompletedSampleCount: BuiltValueNullFieldError.checkNotNull(
              totalCompletedSampleCount,
              r'TeamActivityProgressResponseData',
              'totalCompletedSampleCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
