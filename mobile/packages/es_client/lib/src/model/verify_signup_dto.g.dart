// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_signup_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VerifySignupDto extends VerifySignupDto {
  @override
  final String? email;
  @override
  final String? phone;
  @override
  final num otp;
  @override
  final String firstName;
  @override
  final String? lastName;
  @override
  final String workspaceName;

  factory _$VerifySignupDto([void Function(VerifySignupDtoBuilder)? updates]) =>
      (VerifySignupDtoBuilder()..update(updates))._build();

  _$VerifySignupDto._(
      {this.email,
      this.phone,
      required this.otp,
      required this.firstName,
      this.lastName,
      required this.workspaceName})
      : super._();
  @override
  VerifySignupDto rebuild(void Function(VerifySignupDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VerifySignupDtoBuilder toBuilder() => VerifySignupDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VerifySignupDto &&
        email == other.email &&
        phone == other.phone &&
        otp == other.otp &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        workspaceName == other.workspaceName;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, phone.hashCode);
    _$hash = $jc(_$hash, otp.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, workspaceName.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VerifySignupDto')
          ..add('email', email)
          ..add('phone', phone)
          ..add('otp', otp)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('workspaceName', workspaceName))
        .toString();
  }
}

class VerifySignupDtoBuilder
    implements Builder<VerifySignupDto, VerifySignupDtoBuilder> {
  _$VerifySignupDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _phone;
  String? get phone => _$this._phone;
  set phone(String? phone) => _$this._phone = phone;

  num? _otp;
  num? get otp => _$this._otp;
  set otp(num? otp) => _$this._otp = otp;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _workspaceName;
  String? get workspaceName => _$this._workspaceName;
  set workspaceName(String? workspaceName) =>
      _$this._workspaceName = workspaceName;

  VerifySignupDtoBuilder() {
    VerifySignupDto._defaults(this);
  }

  VerifySignupDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _phone = $v.phone;
      _otp = $v.otp;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _workspaceName = $v.workspaceName;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VerifySignupDto other) {
    _$v = other as _$VerifySignupDto;
  }

  @override
  void update(void Function(VerifySignupDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VerifySignupDto build() => _build();

  _$VerifySignupDto _build() {
    final _$result = _$v ??
        _$VerifySignupDto._(
          email: email,
          phone: phone,
          otp: BuiltValueNullFieldError.checkNotNull(
              otp, r'VerifySignupDto', 'otp'),
          firstName: BuiltValueNullFieldError.checkNotNull(
              firstName, r'VerifySignupDto', 'firstName'),
          lastName: lastName,
          workspaceName: BuiltValueNullFieldError.checkNotNull(
              workspaceName, r'VerifySignupDto', 'workspaceName'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
