// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_members_list_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateMembersListDto extends CreateMembersListDto {
  @override
  final String project;
  @override
  final String teamId;
  @override
  final BuiltList<MemberDto> members;

  factory _$CreateMembersListDto(
          [void Function(CreateMembersListDtoBuilder)? updates]) =>
      (CreateMembersListDtoBuilder()..update(updates))._build();

  _$CreateMembersListDto._(
      {required this.project, required this.teamId, required this.members})
      : super._();
  @override
  CreateMembersListDto rebuild(
          void Function(CreateMembersListDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateMembersListDtoBuilder toBuilder() =>
      CreateMembersListDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateMembersListDto &&
        project == other.project &&
        teamId == other.teamId &&
        members == other.members;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, teamId.hashCode);
    _$hash = $jc(_$hash, members.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateMembersListDto')
          ..add('project', project)
          ..add('teamId', teamId)
          ..add('members', members))
        .toString();
  }
}

class CreateMembersListDtoBuilder
    implements Builder<CreateMembersListDto, CreateMembersListDtoBuilder> {
  _$CreateMembersListDto? _$v;

  String? _project;
  String? get project => _$this._project;
  set project(String? project) => _$this._project = project;

  String? _teamId;
  String? get teamId => _$this._teamId;
  set teamId(String? teamId) => _$this._teamId = teamId;

  ListBuilder<MemberDto>? _members;
  ListBuilder<MemberDto> get members =>
      _$this._members ??= ListBuilder<MemberDto>();
  set members(ListBuilder<MemberDto>? members) => _$this._members = members;

  CreateMembersListDtoBuilder() {
    CreateMembersListDto._defaults(this);
  }

  CreateMembersListDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _project = $v.project;
      _teamId = $v.teamId;
      _members = $v.members.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateMembersListDto other) {
    _$v = other as _$CreateMembersListDto;
  }

  @override
  void update(void Function(CreateMembersListDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateMembersListDto build() => _build();

  _$CreateMembersListDto _build() {
    _$CreateMembersListDto _$result;
    try {
      _$result = _$v ??
          _$CreateMembersListDto._(
            project: BuiltValueNullFieldError.checkNotNull(
                project, r'CreateMembersListDto', 'project'),
            teamId: BuiltValueNullFieldError.checkNotNull(
                teamId, r'CreateMembersListDto', 'teamId'),
            members: members.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'members';
        members.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateMembersListDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
