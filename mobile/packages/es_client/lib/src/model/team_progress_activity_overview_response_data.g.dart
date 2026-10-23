// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_progress_activity_overview_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamProgressActivityOverviewResponseData
    extends TeamProgressActivityOverviewResponseData {
  @override
  final num activeMembers;
  @override
  final num collectedSamples;

  factory _$TeamProgressActivityOverviewResponseData(
          [void Function(TeamProgressActivityOverviewResponseDataBuilder)?
              updates]) =>
      (TeamProgressActivityOverviewResponseDataBuilder()..update(updates))
          ._build();

  _$TeamProgressActivityOverviewResponseData._(
      {required this.activeMembers, required this.collectedSamples})
      : super._();
  @override
  TeamProgressActivityOverviewResponseData rebuild(
          void Function(TeamProgressActivityOverviewResponseDataBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamProgressActivityOverviewResponseDataBuilder toBuilder() =>
      TeamProgressActivityOverviewResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamProgressActivityOverviewResponseData &&
        activeMembers == other.activeMembers &&
        collectedSamples == other.collectedSamples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, activeMembers.hashCode);
    _$hash = $jc(_$hash, collectedSamples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'TeamProgressActivityOverviewResponseData')
          ..add('activeMembers', activeMembers)
          ..add('collectedSamples', collectedSamples))
        .toString();
  }
}

class TeamProgressActivityOverviewResponseDataBuilder
    implements
        Builder<TeamProgressActivityOverviewResponseData,
            TeamProgressActivityOverviewResponseDataBuilder> {
  _$TeamProgressActivityOverviewResponseData? _$v;

  num? _activeMembers;
  num? get activeMembers => _$this._activeMembers;
  set activeMembers(num? activeMembers) =>
      _$this._activeMembers = activeMembers;

  num? _collectedSamples;
  num? get collectedSamples => _$this._collectedSamples;
  set collectedSamples(num? collectedSamples) =>
      _$this._collectedSamples = collectedSamples;

  TeamProgressActivityOverviewResponseDataBuilder() {
    TeamProgressActivityOverviewResponseData._defaults(this);
  }

  TeamProgressActivityOverviewResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _activeMembers = $v.activeMembers;
      _collectedSamples = $v.collectedSamples;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamProgressActivityOverviewResponseData other) {
    _$v = other as _$TeamProgressActivityOverviewResponseData;
  }

  @override
  void update(
      void Function(TeamProgressActivityOverviewResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamProgressActivityOverviewResponseData build() => _build();

  _$TeamProgressActivityOverviewResponseData _build() {
    final _$result = _$v ??
        _$TeamProgressActivityOverviewResponseData._(
          activeMembers: BuiltValueNullFieldError.checkNotNull(activeMembers,
              r'TeamProgressActivityOverviewResponseData', 'activeMembers'),
          collectedSamples: BuiltValueNullFieldError.checkNotNull(
              collectedSamples,
              r'TeamProgressActivityOverviewResponseData',
              'collectedSamples'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
