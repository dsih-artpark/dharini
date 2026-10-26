// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_remove_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberRemoveDto extends TeamMemberRemoveDto {
  @override
  final String teamId;
  @override
  final BuiltList<String> memberIds;

  factory _$TeamMemberRemoveDto(
          [void Function(TeamMemberRemoveDtoBuilder)? updates]) =>
      (TeamMemberRemoveDtoBuilder()..update(updates))._build();

  _$TeamMemberRemoveDto._({required this.teamId, required this.memberIds})
      : super._();
  @override
  TeamMemberRemoveDto rebuild(
          void Function(TeamMemberRemoveDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberRemoveDtoBuilder toBuilder() =>
      TeamMemberRemoveDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberRemoveDto &&
        teamId == other.teamId &&
        memberIds == other.memberIds;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, teamId.hashCode);
    _$hash = $jc(_$hash, memberIds.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamMemberRemoveDto')
          ..add('teamId', teamId)
          ..add('memberIds', memberIds))
        .toString();
  }
}

class TeamMemberRemoveDtoBuilder
    implements Builder<TeamMemberRemoveDto, TeamMemberRemoveDtoBuilder> {
  _$TeamMemberRemoveDto? _$v;

  String? _teamId;
  String? get teamId => _$this._teamId;
  set teamId(String? teamId) => _$this._teamId = teamId;

  ListBuilder<String>? _memberIds;
  ListBuilder<String> get memberIds =>
      _$this._memberIds ??= ListBuilder<String>();
  set memberIds(ListBuilder<String>? memberIds) =>
      _$this._memberIds = memberIds;

  TeamMemberRemoveDtoBuilder() {
    TeamMemberRemoveDto._defaults(this);
  }

  TeamMemberRemoveDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _teamId = $v.teamId;
      _memberIds = $v.memberIds.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamMemberRemoveDto other) {
    _$v = other as _$TeamMemberRemoveDto;
  }

  @override
  void update(void Function(TeamMemberRemoveDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberRemoveDto build() => _build();

  _$TeamMemberRemoveDto _build() {
    _$TeamMemberRemoveDto _$result;
    try {
      _$result = _$v ??
          _$TeamMemberRemoveDto._(
            teamId: BuiltValueNullFieldError.checkNotNull(
                teamId, r'TeamMemberRemoveDto', 'teamId'),
            memberIds: memberIds.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'memberIds';
        memberIds.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamMemberRemoveDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
