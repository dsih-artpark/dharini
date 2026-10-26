// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_members_collector_list_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMembersCollectorListType extends TeamMembersCollectorListType {
  @override
  final String id;
  @override
  final String firstName;
  @override
  final String lastName;
  @override
  final num siteCount;
  @override
  final DateTime? lastVisitedVisit;

  factory _$TeamMembersCollectorListType(
          [void Function(TeamMembersCollectorListTypeBuilder)? updates]) =>
      (TeamMembersCollectorListTypeBuilder()..update(updates))._build();

  _$TeamMembersCollectorListType._(
      {required this.id,
      required this.firstName,
      required this.lastName,
      required this.siteCount,
      this.lastVisitedVisit})
      : super._();
  @override
  TeamMembersCollectorListType rebuild(
          void Function(TeamMembersCollectorListTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMembersCollectorListTypeBuilder toBuilder() =>
      TeamMembersCollectorListTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMembersCollectorListType &&
        id == other.id &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        siteCount == other.siteCount &&
        lastVisitedVisit == other.lastVisitedVisit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, siteCount.hashCode);
    _$hash = $jc(_$hash, lastVisitedVisit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamMembersCollectorListType')
          ..add('id', id)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('siteCount', siteCount)
          ..add('lastVisitedVisit', lastVisitedVisit))
        .toString();
  }
}

class TeamMembersCollectorListTypeBuilder
    implements
        Builder<TeamMembersCollectorListType,
            TeamMembersCollectorListTypeBuilder> {
  _$TeamMembersCollectorListType? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  num? _siteCount;
  num? get siteCount => _$this._siteCount;
  set siteCount(num? siteCount) => _$this._siteCount = siteCount;

  DateTime? _lastVisitedVisit;
  DateTime? get lastVisitedVisit => _$this._lastVisitedVisit;
  set lastVisitedVisit(DateTime? lastVisitedVisit) =>
      _$this._lastVisitedVisit = lastVisitedVisit;

  TeamMembersCollectorListTypeBuilder() {
    TeamMembersCollectorListType._defaults(this);
  }

  TeamMembersCollectorListTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _siteCount = $v.siteCount;
      _lastVisitedVisit = $v.lastVisitedVisit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamMembersCollectorListType other) {
    _$v = other as _$TeamMembersCollectorListType;
  }

  @override
  void update(void Function(TeamMembersCollectorListTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMembersCollectorListType build() => _build();

  _$TeamMembersCollectorListType _build() {
    final _$result = _$v ??
        _$TeamMembersCollectorListType._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'TeamMembersCollectorListType', 'id'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'TeamMembersCollectorListType', 'firstName'),
          lastName: BuiltValueNullFieldError.checkNotNull(
              lastName, r'TeamMembersCollectorListType', 'lastName'),
          siteCount: BuiltValueNullFieldError.checkNotNull(
              siteCount, r'TeamMembersCollectorListType', 'siteCount'),
          lastVisitedVisit: lastVisitedVisit,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
