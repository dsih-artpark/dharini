// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Team extends Team {
  @override
  final String id;
  @override
  final String? teamName;
  @override
  final String? address;
  @override
  final String? logo;

  factory _$Team([void Function(TeamBuilder)? updates]) =>
      (TeamBuilder()..update(updates))._build();

  _$Team._({required this.id, this.teamName, this.address, this.logo})
      : super._();
  @override
  Team rebuild(void Function(TeamBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamBuilder toBuilder() => TeamBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Team &&
        id == other.id &&
        teamName == other.teamName &&
        address == other.address &&
        logo == other.logo;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, teamName.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, logo.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Team')
          ..add('id', id)
          ..add('teamName', teamName)
          ..add('address', address)
          ..add('logo', logo))
        .toString();
  }
}

class TeamBuilder implements Builder<Team, TeamBuilder> {
  _$Team? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _teamName;
  String? get teamName => _$this._teamName;
  set teamName(String? teamName) => _$this._teamName = teamName;

  String? _address;
  String? get address => _$this._address;
  set address(String? address) => _$this._address = address;

  String? _logo;
  String? get logo => _$this._logo;
  set logo(String? logo) => _$this._logo = logo;

  TeamBuilder() {
    Team._defaults(this);
  }

  TeamBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _teamName = $v.teamName;
      _address = $v.address;
      _logo = $v.logo;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Team other) {
    _$v = other as _$Team;
  }

  @override
  void update(void Function(TeamBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Team build() => _build();

  _$Team _build() {
    final _$result = _$v ??
        _$Team._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Team', 'id'),
          teamName: teamName,
          address: address,
          logo: logo,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
