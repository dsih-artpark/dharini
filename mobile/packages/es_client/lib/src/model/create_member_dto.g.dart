// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_member_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateMemberDto extends CreateMemberDto {
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? email;
  @override
  final String? contactNumber;
  @override
  final JsonObject? role;
  @override
  final String project;

  factory _$CreateMemberDto([void Function(CreateMemberDtoBuilder)? updates]) =>
      (CreateMemberDtoBuilder()..update(updates))._build();

  _$CreateMemberDto._(
      {this.firstName,
      this.lastName,
      this.email,
      this.contactNumber,
      this.role,
      required this.project})
      : super._();
  @override
  CreateMemberDto rebuild(void Function(CreateMemberDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateMemberDtoBuilder toBuilder() => CreateMemberDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateMemberDto &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        email == other.email &&
        contactNumber == other.contactNumber &&
        role == other.role &&
        project == other.project;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateMemberDto')
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('email', email)
          ..add('contactNumber', contactNumber)
          ..add('role', role)
          ..add('project', project))
        .toString();
  }
}

class CreateMemberDtoBuilder
    implements Builder<CreateMemberDto, CreateMemberDtoBuilder> {
  _$CreateMemberDto? _$v;

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

  JsonObject? _role;
  JsonObject? get role => _$this._role;
  set role(JsonObject? role) => _$this._role = role;

  String? _project;
  String? get project => _$this._project;
  set project(String? project) => _$this._project = project;

  CreateMemberDtoBuilder() {
    CreateMemberDto._defaults(this);
  }

  CreateMemberDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _email = $v.email;
      _contactNumber = $v.contactNumber;
      _role = $v.role;
      _project = $v.project;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateMemberDto other) {
    _$v = other as _$CreateMemberDto;
  }

  @override
  void update(void Function(CreateMemberDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateMemberDto build() => _build();

  _$CreateMemberDto _build() {
    final _$result = _$v ??
        _$CreateMemberDto._(
          firstName: firstName,
          lastName: lastName,
          email: email,
          contactNumber: contactNumber,
          role: role,
          project: BuiltValueNullFieldError.checkNotNull(
              project, r'CreateMemberDto', 'project'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
