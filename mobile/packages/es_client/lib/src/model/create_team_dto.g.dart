// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_team_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateTeamDto extends CreateTeamDto {
  @override
  final String teamName;
  @override
  final String firstName;
  @override
  final String lastName;
  @override
  final String email;
  @override
  final String? contactNumber;
  @override
  final bool isProjectViewer;

  factory _$CreateTeamDto([void Function(CreateTeamDtoBuilder)? updates]) =>
      (CreateTeamDtoBuilder()..update(updates))._build();

  _$CreateTeamDto._(
      {required this.teamName,
      required this.firstName,
      required this.lastName,
      required this.email,
      this.contactNumber,
      required this.isProjectViewer})
      : super._();
  @override
  CreateTeamDto rebuild(void Function(CreateTeamDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateTeamDtoBuilder toBuilder() => CreateTeamDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateTeamDto &&
        teamName == other.teamName &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        email == other.email &&
        contactNumber == other.contactNumber &&
        isProjectViewer == other.isProjectViewer;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, teamName.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, isProjectViewer.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateTeamDto')
          ..add('teamName', teamName)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('email', email)
          ..add('contactNumber', contactNumber)
          ..add('isProjectViewer', isProjectViewer))
        .toString();
  }
}

class CreateTeamDtoBuilder
    implements Builder<CreateTeamDto, CreateTeamDtoBuilder> {
  _$CreateTeamDto? _$v;

  String? _teamName;
  String? get teamName => _$this._teamName;
  set teamName(String? teamName) => _$this._teamName = teamName;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  bool? _isProjectViewer;
  bool? get isProjectViewer => _$this._isProjectViewer;
  set isProjectViewer(bool? isProjectViewer) =>
      _$this._isProjectViewer = isProjectViewer;

  CreateTeamDtoBuilder() {
    CreateTeamDto._defaults(this);
  }

  CreateTeamDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _teamName = $v.teamName;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _email = $v.email;
      _contactNumber = $v.contactNumber;
      _isProjectViewer = $v.isProjectViewer;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateTeamDto other) {
    _$v = other as _$CreateTeamDto;
  }

  @override
  void update(void Function(CreateTeamDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateTeamDto build() => _build();

  _$CreateTeamDto _build() {
    final _$result = _$v ??
        _$CreateTeamDto._(
          teamName: BuiltValueNullFieldError.checkNotNull(
              teamName, r'CreateTeamDto', 'teamName'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'CreateTeamDto', 'firstName'),
          lastName: BuiltValueNullFieldError.checkNotNull(
              lastName, r'CreateTeamDto', 'lastName'),
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'CreateTeamDto', 'email'),
          contactNumber: contactNumber,
          isProjectViewer: BuiltValueNullFieldError.checkNotNull(
              isProjectViewer, r'CreateTeamDto', 'isProjectViewer'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
