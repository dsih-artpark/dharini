// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistics_by_site_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatisticsBySiteResponseData
    extends ProjectStatisticsBySiteResponseData {
  @override
  final num total;
  @override
  final num pending;
  @override
  final num positive;
  @override
  final num negative;

  factory _$ProjectStatisticsBySiteResponseData(
          [void Function(ProjectStatisticsBySiteResponseDataBuilder)?
              updates]) =>
      (ProjectStatisticsBySiteResponseDataBuilder()..update(updates))._build();

  _$ProjectStatisticsBySiteResponseData._(
      {required this.total,
      required this.pending,
      required this.positive,
      required this.negative})
      : super._();
  @override
  ProjectStatisticsBySiteResponseData rebuild(
          void Function(ProjectStatisticsBySiteResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticsBySiteResponseDataBuilder toBuilder() =>
      ProjectStatisticsBySiteResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatisticsBySiteResponseData &&
        total == other.total &&
        pending == other.pending &&
        positive == other.positive &&
        negative == other.negative;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, pending.hashCode);
    _$hash = $jc(_$hash, positive.hashCode);
    _$hash = $jc(_$hash, negative.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectStatisticsBySiteResponseData')
          ..add('total', total)
          ..add('pending', pending)
          ..add('positive', positive)
          ..add('negative', negative))
        .toString();
  }
}

class ProjectStatisticsBySiteResponseDataBuilder
    implements
        Builder<ProjectStatisticsBySiteResponseData,
            ProjectStatisticsBySiteResponseDataBuilder> {
  _$ProjectStatisticsBySiteResponseData? _$v;

  num? _total;
  num? get total => _$this._total;
  set total(num? total) => _$this._total = total;

  num? _pending;
  num? get pending => _$this._pending;
  set pending(num? pending) => _$this._pending = pending;

  num? _positive;
  num? get positive => _$this._positive;
  set positive(num? positive) => _$this._positive = positive;

  num? _negative;
  num? get negative => _$this._negative;
  set negative(num? negative) => _$this._negative = negative;

  ProjectStatisticsBySiteResponseDataBuilder() {
    ProjectStatisticsBySiteResponseData._defaults(this);
  }

  ProjectStatisticsBySiteResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _total = $v.total;
      _pending = $v.pending;
      _positive = $v.positive;
      _negative = $v.negative;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectStatisticsBySiteResponseData other) {
    _$v = other as _$ProjectStatisticsBySiteResponseData;
  }

  @override
  void update(
      void Function(ProjectStatisticsBySiteResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatisticsBySiteResponseData build() => _build();

  _$ProjectStatisticsBySiteResponseData _build() {
    final _$result = _$v ??
        _$ProjectStatisticsBySiteResponseData._(
          total: BuiltValueNullFieldError.checkNotNull(
              total, r'ProjectStatisticsBySiteResponseData', 'total'),
          pending: BuiltValueNullFieldError.checkNotNull(
              pending, r'ProjectStatisticsBySiteResponseData', 'pending'),
          positive: BuiltValueNullFieldError.checkNotNull(
              positive, r'ProjectStatisticsBySiteResponseData', 'positive'),
          negative: BuiltValueNullFieldError.checkNotNull(
              negative, r'ProjectStatisticsBySiteResponseData', 'negative'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
