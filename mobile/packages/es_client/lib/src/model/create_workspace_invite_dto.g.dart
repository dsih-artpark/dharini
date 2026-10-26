// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_workspace_invite_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateWorkspaceInviteDto extends CreateWorkspaceInviteDto {
  @override
  final String email;
  @override
  final String workspaceId;
  @override
  final String roleId;
  @override
  final String? firstName;
  @override
  final String? lastName;

  factory _$CreateWorkspaceInviteDto(
          [void Function(CreateWorkspaceInviteDtoBuilder)? updates]) =>
      (CreateWorkspaceInviteDtoBuilder()..update(updates))._build();

  _$CreateWorkspaceInviteDto._(
      {required this.email,
      required this.workspaceId,
      required this.roleId,
      this.firstName,
      this.lastName})
      : super._();
  @override
  CreateWorkspaceInviteDto rebuild(
          void Function(CreateWorkspaceInviteDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateWorkspaceInviteDtoBuilder toBuilder() =>
      CreateWorkspaceInviteDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateWorkspaceInviteDto &&
        email == other.email &&
        workspaceId == other.workspaceId &&
        roleId == other.roleId &&
        firstName == other.firstName &&
        lastName == other.lastName;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, workspaceId.hashCode);
    _$hash = $jc(_$hash, roleId.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateWorkspaceInviteDto')
          ..add('email', email)
          ..add('workspaceId', workspaceId)
          ..add('roleId', roleId)
          ..add('firstName', firstName)
          ..add('lastName', lastName))
        .toString();
  }
}

class CreateWorkspaceInviteDtoBuilder
    implements
        Builder<CreateWorkspaceInviteDto, CreateWorkspaceInviteDtoBuilder> {
  _$CreateWorkspaceInviteDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _workspaceId;
  String? get workspaceId => _$this._workspaceId;
  set workspaceId(String? workspaceId) => _$this._workspaceId = workspaceId;

  String? _roleId;
  String? get roleId => _$this._roleId;
  set roleId(String? roleId) => _$this._roleId = roleId;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  CreateWorkspaceInviteDtoBuilder() {
    CreateWorkspaceInviteDto._defaults(this);
  }

  CreateWorkspaceInviteDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _workspaceId = $v.workspaceId;
      _roleId = $v.roleId;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateWorkspaceInviteDto other) {
    _$v = other as _$CreateWorkspaceInviteDto;
  }

  @override
  void update(void Function(CreateWorkspaceInviteDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateWorkspaceInviteDto build() => _build();

  _$CreateWorkspaceInviteDto _build() {
    final _$result = _$v ??
        _$CreateWorkspaceInviteDto._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'CreateWorkspaceInviteDto', 'email'),
          workspaceId: BuiltValueNullFieldError.checkNotNull(
              workspaceId, r'CreateWorkspaceInviteDto', 'workspaceId'),
          roleId: BuiltValueNullFieldError.checkNotNull(
              roleId, r'CreateWorkspaceInviteDto', 'roleId'),
          firstName: firstName,
          lastName: lastName,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
