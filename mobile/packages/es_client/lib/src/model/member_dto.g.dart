// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MemberDto extends MemberDto {
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

  factory _$MemberDto([void Function(MemberDtoBuilder)? updates]) =>
      (MemberDtoBuilder()..update(updates))._build();

  _$MemberDto._(
      {this.firstName,
      this.lastName,
      this.email,
      this.contactNumber,
      this.role})
      : super._();
  @override
  MemberDto rebuild(void Function(MemberDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MemberDtoBuilder toBuilder() => MemberDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MemberDto &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        email == other.email &&
        contactNumber == other.contactNumber &&
        role == other.role;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, role.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MemberDto')
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('email', email)
          ..add('contactNumber', contactNumber)
          ..add('role', role))
        .toString();
  }
}

class MemberDtoBuilder implements Builder<MemberDto, MemberDtoBuilder> {
  _$MemberDto? _$v;

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

  MemberDtoBuilder() {
    MemberDto._defaults(this);
  }

  MemberDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _email = $v.email;
      _contactNumber = $v.contactNumber;
      _role = $v.role;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MemberDto other) {
    _$v = other as _$MemberDto;
  }

  @override
  void update(void Function(MemberDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MemberDto build() => _build();

  _$MemberDto _build() {
    final _$result = _$v ??
        _$MemberDto._(
          firstName: firstName,
          lastName: lastName,
          email: email,
          contactNumber: contactNumber,
          role: role,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
