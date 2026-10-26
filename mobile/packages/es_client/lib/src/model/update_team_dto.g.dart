// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_team_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateTeamDto extends UpdateTeamDto {
  @override
  final String? teamName;
  @override
  final String? address;
  @override
  final String? logo;

  factory _$UpdateTeamDto([void Function(UpdateTeamDtoBuilder)? updates]) =>
      (UpdateTeamDtoBuilder()..update(updates))._build();

  _$UpdateTeamDto._({this.teamName, this.address, this.logo}) : super._();
  @override
  UpdateTeamDto rebuild(void Function(UpdateTeamDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateTeamDtoBuilder toBuilder() => UpdateTeamDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateTeamDto &&
        teamName == other.teamName &&
        address == other.address &&
        logo == other.logo;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, teamName.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, logo.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateTeamDto')
          ..add('teamName', teamName)
          ..add('address', address)
          ..add('logo', logo))
        .toString();
  }
}

class UpdateTeamDtoBuilder
    implements Builder<UpdateTeamDto, UpdateTeamDtoBuilder> {
  _$UpdateTeamDto? _$v;

  String? _teamName;
  String? get teamName => _$this._teamName;
  set teamName(String? teamName) => _$this._teamName = teamName;

  String? _address;
  String? get address => _$this._address;
  set address(String? address) => _$this._address = address;

  String? _logo;
  String? get logo => _$this._logo;
  set logo(String? logo) => _$this._logo = logo;

  UpdateTeamDtoBuilder() {
    UpdateTeamDto._defaults(this);
  }

  UpdateTeamDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _teamName = $v.teamName;
      _address = $v.address;
      _logo = $v.logo;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateTeamDto other) {
    _$v = other as _$UpdateTeamDto;
  }

  @override
  void update(void Function(UpdateTeamDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateTeamDto build() => _build();

  _$UpdateTeamDto _build() {
    final _$result = _$v ??
        _$UpdateTeamDto._(
          teamName: teamName,
          address: address,
          logo: logo,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
