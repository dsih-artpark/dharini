// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_summary_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserSummaryResponse extends UserSummaryResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final UserResponseType data;

  factory _$UserSummaryResponse(
          [void Function(UserSummaryResponseBuilder)? updates]) =>
      (UserSummaryResponseBuilder()..update(updates))._build();

  _$UserSummaryResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  UserSummaryResponse rebuild(
          void Function(UserSummaryResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserSummaryResponseBuilder toBuilder() =>
      UserSummaryResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserSummaryResponse &&
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
    return (newBuiltValueToStringHelper(r'UserSummaryResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class UserSummaryResponseBuilder
    implements Builder<UserSummaryResponse, UserSummaryResponseBuilder> {
  _$UserSummaryResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  UserResponseTypeBuilder? _data;
  UserResponseTypeBuilder get data =>
      _$this._data ??= UserResponseTypeBuilder();
  set data(UserResponseTypeBuilder? data) => _$this._data = data;

  UserSummaryResponseBuilder() {
    UserSummaryResponse._defaults(this);
  }

  UserSummaryResponseBuilder get _$this {
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
  void replace(UserSummaryResponse other) {
    _$v = other as _$UserSummaryResponse;
  }

  @override
  void update(void Function(UserSummaryResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserSummaryResponse build() => _build();

  _$UserSummaryResponse _build() {
    _$UserSummaryResponse _$result;
    try {
      _$result = _$v ??
          _$UserSummaryResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'UserSummaryResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'UserSummaryResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserSummaryResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
