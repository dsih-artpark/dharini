// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_otp_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VerifyOtpResponseData extends VerifyOtpResponseData {
  @override
  final String accessToken;

  factory _$VerifyOtpResponseData(
          [void Function(VerifyOtpResponseDataBuilder)? updates]) =>
      (VerifyOtpResponseDataBuilder()..update(updates))._build();

  _$VerifyOtpResponseData._({required this.accessToken}) : super._();
  @override
  VerifyOtpResponseData rebuild(
          void Function(VerifyOtpResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VerifyOtpResponseDataBuilder toBuilder() =>
      VerifyOtpResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VerifyOtpResponseData && accessToken == other.accessToken;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, accessToken.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VerifyOtpResponseData')
          ..add('accessToken', accessToken))
        .toString();
  }
}

class VerifyOtpResponseDataBuilder
    implements Builder<VerifyOtpResponseData, VerifyOtpResponseDataBuilder> {
  _$VerifyOtpResponseData? _$v;

  String? _accessToken;
  String? get accessToken => _$this._accessToken;
  set accessToken(String? accessToken) => _$this._accessToken = accessToken;

  VerifyOtpResponseDataBuilder() {
    VerifyOtpResponseData._defaults(this);
  }

  VerifyOtpResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _accessToken = $v.accessToken;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VerifyOtpResponseData other) {
    _$v = other as _$VerifyOtpResponseData;
  }

  @override
  void update(void Function(VerifyOtpResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VerifyOtpResponseData build() => _build();

  _$VerifyOtpResponseData _build() {
    final _$result = _$v ??
        _$VerifyOtpResponseData._(
          accessToken: BuiltValueNullFieldError.checkNotNull(
              accessToken, r'VerifyOtpResponseData', 'accessToken'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
