// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sms_otp_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SmsOtpDto extends SmsOtpDto {
  @override
  final String contactNumber;
  @override
  final String message;

  factory _$SmsOtpDto([void Function(SmsOtpDtoBuilder)? updates]) =>
      (SmsOtpDtoBuilder()..update(updates))._build();

  _$SmsOtpDto._({required this.contactNumber, required this.message})
      : super._();
  @override
  SmsOtpDto rebuild(void Function(SmsOtpDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SmsOtpDtoBuilder toBuilder() => SmsOtpDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SmsOtpDto &&
        contactNumber == other.contactNumber &&
        message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SmsOtpDto')
          ..add('contactNumber', contactNumber)
          ..add('message', message))
        .toString();
  }
}

class SmsOtpDtoBuilder implements Builder<SmsOtpDto, SmsOtpDtoBuilder> {
  _$SmsOtpDto? _$v;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SmsOtpDtoBuilder() {
    SmsOtpDto._defaults(this);
  }

  SmsOtpDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _contactNumber = $v.contactNumber;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SmsOtpDto other) {
    _$v = other as _$SmsOtpDto;
  }

  @override
  void update(void Function(SmsOtpDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SmsOtpDto build() => _build();

  _$SmsOtpDto _build() {
    final _$result = _$v ??
        _$SmsOtpDto._(
          contactNumber: BuiltValueNullFieldError.checkNotNull(
              contactNumber, r'SmsOtpDto', 'contactNumber'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'SmsOtpDto', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
