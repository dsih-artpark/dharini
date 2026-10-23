// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserProfileResponse extends UserProfileResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final UserProfileResponseData data;

  factory _$UserProfileResponse(
          [void Function(UserProfileResponseBuilder)? updates]) =>
      (UserProfileResponseBuilder()..update(updates))._build();

  _$UserProfileResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  UserProfileResponse rebuild(
          void Function(UserProfileResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserProfileResponseBuilder toBuilder() =>
      UserProfileResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserProfileResponse &&
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
    return (newBuiltValueToStringHelper(r'UserProfileResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class UserProfileResponseBuilder
    implements Builder<UserProfileResponse, UserProfileResponseBuilder> {
  _$UserProfileResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  UserProfileResponseDataBuilder? _data;
  UserProfileResponseDataBuilder get data =>
      _$this._data ??= UserProfileResponseDataBuilder();
  set data(UserProfileResponseDataBuilder? data) => _$this._data = data;

  UserProfileResponseBuilder() {
    UserProfileResponse._defaults(this);
  }

  UserProfileResponseBuilder get _$this {
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
  void replace(UserProfileResponse other) {
    _$v = other as _$UserProfileResponse;
  }

  @override
  void update(void Function(UserProfileResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserProfileResponse build() => _build();

  _$UserProfileResponse _build() {
    _$UserProfileResponse _$result;
    try {
      _$result = _$v ??
          _$UserProfileResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'UserProfileResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'UserProfileResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserProfileResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
