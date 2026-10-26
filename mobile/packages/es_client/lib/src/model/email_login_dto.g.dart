// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'email_login_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$EmailLoginDto extends EmailLoginDto {
  @override
  final String email;

  factory _$EmailLoginDto([void Function(EmailLoginDtoBuilder)? updates]) =>
      (EmailLoginDtoBuilder()..update(updates))._build();

  _$EmailLoginDto._({required this.email}) : super._();
  @override
  EmailLoginDto rebuild(void Function(EmailLoginDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  EmailLoginDtoBuilder toBuilder() => EmailLoginDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is EmailLoginDto && email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'EmailLoginDto')..add('email', email))
        .toString();
  }
}

class EmailLoginDtoBuilder
    implements Builder<EmailLoginDto, EmailLoginDtoBuilder> {
  _$EmailLoginDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  EmailLoginDtoBuilder() {
    EmailLoginDto._defaults(this);
  }

  EmailLoginDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(EmailLoginDto other) {
    _$v = other as _$EmailLoginDto;
  }

  @override
  void update(void Function(EmailLoginDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  EmailLoginDto build() => _build();

  _$EmailLoginDto _build() {
    final _$result = _$v ??
        _$EmailLoginDto._(
          email: BuiltValueNullFieldError.checkNotNull(
              email, r'EmailLoginDto', 'email'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
