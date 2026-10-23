// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_otp_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VerifyOtpResponse extends VerifyOtpResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final VerifyOtpResponseData data;

  factory _$VerifyOtpResponse(
          [void Function(VerifyOtpResponseBuilder)? updates]) =>
      (VerifyOtpResponseBuilder()..update(updates))._build();

  _$VerifyOtpResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  VerifyOtpResponse rebuild(void Function(VerifyOtpResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VerifyOtpResponseBuilder toBuilder() =>
      VerifyOtpResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VerifyOtpResponse &&
        success == other.success &&
        message == other.message &&
        data == other.data;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VerifyOtpResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class VerifyOtpResponseBuilder
    implements Builder<VerifyOtpResponse, VerifyOtpResponseBuilder> {
  _$VerifyOtpResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  VerifyOtpResponseDataBuilder? _data;
  VerifyOtpResponseDataBuilder get data =>
      _$this._data ??= VerifyOtpResponseDataBuilder();
  set data(VerifyOtpResponseDataBuilder? data) => _$this._data = data;

  VerifyOtpResponseBuilder() {
    VerifyOtpResponse._defaults(this);
  }

  VerifyOtpResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _data = $v.data.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VerifyOtpResponse other) {
    _$v = other as _$VerifyOtpResponse;
  }

  @override
  void update(void Function(VerifyOtpResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VerifyOtpResponse build() => _build();

  _$VerifyOtpResponse _build() {
    _$VerifyOtpResponse _$result;
    try {
      _$result = _$v ??
          _$VerifyOtpResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'VerifyOtpResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'VerifyOtpResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VerifyOtpResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
