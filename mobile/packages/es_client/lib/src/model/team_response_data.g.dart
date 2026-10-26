// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamResponseData extends TeamResponseData {
  @override
  final String id;
  @override
  final String? teamName;
  @override
  final String? address;
  @override
  final String? logo;
  @override
  final BuiltList<User>? members;

  factory _$TeamResponseData(
          [void Function(TeamResponseDataBuilder)? updates]) =>
      (TeamResponseDataBuilder()..update(updates))._build();

  _$TeamResponseData._(
      {required this.id, this.teamName, this.address, this.logo, this.members})
      : super._();
  @override
  TeamResponseData rebuild(void Function(TeamResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamResponseDataBuilder toBuilder() =>
      TeamResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamResponseData &&
        id == other.id &&
        teamName == other.teamName &&
        address == other.address &&
        logo == other.logo &&
        members == other.members;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, teamName.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, logo.hashCode);
    _$hash = $jc(_$hash, members.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamResponseData')
          ..add('id', id)
          ..add('teamName', teamName)
          ..add('address', address)
          ..add('logo', logo)
          ..add('members', members))
        .toString();
  }
}

class TeamResponseDataBuilder
    implements Builder<TeamResponseData, TeamResponseDataBuilder> {
  _$TeamResponseData? _$v;

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

  ListBuilder<User>? _members;
  ListBuilder<User> get members => _$this._members ??= ListBuilder<User>();
  set members(ListBuilder<User>? members) => _$this._members = members;

  TeamResponseDataBuilder() {
    TeamResponseData._defaults(this);
  }

  TeamResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _teamName = $v.teamName;
      _address = $v.address;
      _logo = $v.logo;
      _members = $v.members?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamResponseData other) {
    _$v = other as _$TeamResponseData;
  }

  @override
  void update(void Function(TeamResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamResponseData build() => _build();

  _$TeamResponseData _build() {
    _$TeamResponseData _$result;
    try {
      _$result = _$v ??
          _$TeamResponseData._(
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'TeamResponseData', 'id'),
            teamName: teamName,
            address: address,
            logo: logo,
            members: _members?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'members';
        _members?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
