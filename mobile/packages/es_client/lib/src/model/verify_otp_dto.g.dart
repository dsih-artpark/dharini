// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_otp_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VerifyOtpDto extends VerifyOtpDto {
  @override
  final String? email;
  @override
  final num? phone;
  @override
  final num otp;

  factory _$VerifyOtpDto([void Function(VerifyOtpDtoBuilder)? updates]) =>
      (VerifyOtpDtoBuilder()..update(updates))._build();

  _$VerifyOtpDto._({this.email, this.phone, required this.otp}) : super._();
  @override
  VerifyOtpDto rebuild(void Function(VerifyOtpDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VerifyOtpDtoBuilder toBuilder() => VerifyOtpDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VerifyOtpDto &&
        email == other.email &&
        phone == other.phone &&
        otp == other.otp;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, phone.hashCode);
    _$hash = $jc(_$hash, otp.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VerifyOtpDto')
          ..add('email', email)
          ..add('phone', phone)
          ..add('otp', otp))
        .toString();
  }
}

class VerifyOtpDtoBuilder
    implements Builder<VerifyOtpDto, VerifyOtpDtoBuilder> {
  _$VerifyOtpDto? _$v;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  num? _phone;
  num? get phone => _$this._phone;
  set phone(num? phone) => _$this._phone = phone;

  num? _otp;
  num? get otp => _$this._otp;
  set otp(num? otp) => _$this._otp = otp;

  VerifyOtpDtoBuilder() {
    VerifyOtpDto._defaults(this);
  }

  VerifyOtpDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _email = $v.email;
      _phone = $v.phone;
      _otp = $v.otp;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VerifyOtpDto other) {
    _$v = other as _$VerifyOtpDto;
  }

  @override
  void update(void Function(VerifyOtpDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VerifyOtpDto build() => _build();

  _$VerifyOtpDto _build() {
    final _$result = _$v ??
        _$VerifyOtpDto._(
          email: email,
          phone: phone,
          otp: BuiltValueNullFieldError.checkNotNull(
              otp, r'VerifyOtpDto', 'otp'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
