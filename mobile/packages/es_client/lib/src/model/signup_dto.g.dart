// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'signup_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SignupDto extends SignupDto {
  @override
  final String? email;
  @override
  final String? phone;

  factory _$SignupDto([void Function(SignupDtoBuilder)? updates]) =>
      (SignupDtoBuilder()..update(updates))._build();

  _$SignupDto._({this.email, this.phone}) : super._();
  @override
  SignupDto rebuild(void Function(SignupDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SignupDtoBuilder toBuilder() => SignupDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SignupDto && email == other.email && phone == other.phone;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, phone.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SignupDto')
          ..add('email', email)
          ..add('phone', phone))
        .toString();
  }
}

class SignupDtoBuilder implements Builder<SignupDto, SignupDtoBuilder> {
  _$SignupDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _phone;
  String? get phone => _$this._phone;
  set phone(String? phone) => _$this._phone = phone;

  SignupDtoBuilder() {
    SignupDto._defaults(this);
  }

  SignupDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _phone = $v.phone;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SignupDto other) {
    _$v = other as _$SignupDto;
  }

  @override
  void update(void Function(SignupDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SignupDto build() => _build();

  _$SignupDto _build() {
    final _$result = _$v ??
        _$SignupDto._(
          email: email,
          phone: phone,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
