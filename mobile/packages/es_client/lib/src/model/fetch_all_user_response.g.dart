// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fetch_all_user_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FetchAllUserResponse extends FetchAllUserResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<UserResponseType> data;

  factory _$FetchAllUserResponse(
          [void Function(FetchAllUserResponseBuilder)? updates]) =>
      (FetchAllUserResponseBuilder()..update(updates))._build();

  _$FetchAllUserResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  FetchAllUserResponse rebuild(
          void Function(FetchAllUserResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FetchAllUserResponseBuilder toBuilder() =>
      FetchAllUserResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FetchAllUserResponse &&
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
    return (newBuiltValueToStringHelper(r'FetchAllUserResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class FetchAllUserResponseBuilder
    implements Builder<FetchAllUserResponse, FetchAllUserResponseBuilder> {
  _$FetchAllUserResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<UserResponseType>? _data;
  ListBuilder<UserResponseType> get data =>
      _$this._data ??= ListBuilder<UserResponseType>();
  set data(ListBuilder<UserResponseType>? data) => _$this._data = data;

  FetchAllUserResponseBuilder() {
    FetchAllUserResponse._defaults(this);
  }

  FetchAllUserResponseBuilder get _$this {
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
  void replace(FetchAllUserResponse other) {
    _$v = other as _$FetchAllUserResponse;
  }

  @override
  void update(void Function(FetchAllUserResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FetchAllUserResponse build() => _build();

  _$FetchAllUserResponse _build() {
    _$FetchAllUserResponse _$result;
    try {
      _$result = _$v ??
          _$FetchAllUserResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'FetchAllUserResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'FetchAllUserResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FetchAllUserResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
