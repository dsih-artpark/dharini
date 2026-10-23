// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_super_admin_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateSuperAdminDto extends CreateSuperAdminDto {
  @override
  final String email;
  @override
  final String firstName;
  @override
  final String lastName;
  @override
  final String? contactNumber;
  @override
  final String? role;

  factory _$CreateSuperAdminDto(
          [void Function(CreateSuperAdminDtoBuilder)? updates]) =>
      (CreateSuperAdminDtoBuilder()..update(updates))._build();

  _$CreateSuperAdminDto._(
      {required this.email,
      required this.firstName,
      required this.lastName,
      this.contactNumber,
      this.role})
      : super._();
  @override
  CreateSuperAdminDto rebuild(
          void Function(CreateSuperAdminDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateSuperAdminDtoBuilder toBuilder() =>
      CreateSuperAdminDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateSuperAdminDto &&
        email == other.email &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        contactNumber == other.contactNumber &&
        role == other.role;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateSuperAdminDto')
          ..add('email', email)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('contactNumber', contactNumber)
          ..add('role', role))
        .toString();
  }
}

class CreateSuperAdminDtoBuilder
    implements Builder<CreateSuperAdminDto, CreateSuperAdminDtoBuilder> {
  _$CreateSuperAdminDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  String? _role;
  String? get role => _$this._role;
  set role(String? role) => _$this._role = role;

  CreateSuperAdminDtoBuilder() {
    CreateSuperAdminDto._defaults(this);
  }

  CreateSuperAdminDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _contactNumber = $v.contactNumber;
      _role = $v.role;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateSuperAdminDto other) {
    _$v = other as _$CreateSuperAdminDto;
  }

  @override
  void update(void Function(CreateSuperAdminDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateSuperAdminDto build() => _build();

  _$CreateSuperAdminDto _build() {
    final _$result = _$v ??
        _$CreateSuperAdminDto._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'CreateSuperAdminDto', 'email'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'CreateSuperAdminDto', 'firstName'),
          lastName: BuiltValueNullFieldError.checkNotNull(
              lastName, r'CreateSuperAdminDto', 'lastName'),
          contactNumber: contactNumber,
          role: role,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
