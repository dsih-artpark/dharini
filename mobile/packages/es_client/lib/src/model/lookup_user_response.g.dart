// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lookup_user_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LookupUserResponse extends LookupUserResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final LookupUserResult data;

  factory _$LookupUserResponse(
          [void Function(LookupUserResponseBuilder)? updates]) =>
      (LookupUserResponseBuilder()..update(updates))._build();

  _$LookupUserResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  LookupUserResponse rebuild(
          void Function(LookupUserResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LookupUserResponseBuilder toBuilder() =>
      LookupUserResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LookupUserResponse &&
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
    return (newBuiltValueToStringHelper(r'LookupUserResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class LookupUserResponseBuilder
    implements Builder<LookupUserResponse, LookupUserResponseBuilder> {
  _$LookupUserResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  LookupUserResultBuilder? _data;
  LookupUserResultBuilder get data =>
      _$this._data ??= LookupUserResultBuilder();
  set data(LookupUserResultBuilder? data) => _$this._data = data;

  LookupUserResponseBuilder() {
    LookupUserResponse._defaults(this);
  }

  LookupUserResponseBuilder get _$this {
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
  void replace(LookupUserResponse other) {
    _$v = other as _$LookupUserResponse;
  }

  @override
  void update(void Function(LookupUserResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LookupUserResponse build() => _build();

  _$LookupUserResponse _build() {
    _$LookupUserResponse _$result;
    try {
      _$result = _$v ??
          _$LookupUserResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'LookupUserResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'LookupUserResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LookupUserResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
