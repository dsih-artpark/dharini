// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fetch_all_invite_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FetchAllInviteResponse extends FetchAllInviteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<Invite> data;

  factory _$FetchAllInviteResponse(
          [void Function(FetchAllInviteResponseBuilder)? updates]) =>
      (FetchAllInviteResponseBuilder()..update(updates))._build();

  _$FetchAllInviteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  FetchAllInviteResponse rebuild(
          void Function(FetchAllInviteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FetchAllInviteResponseBuilder toBuilder() =>
      FetchAllInviteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FetchAllInviteResponse &&
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
    return (newBuiltValueToStringHelper(r'FetchAllInviteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class FetchAllInviteResponseBuilder
    implements Builder<FetchAllInviteResponse, FetchAllInviteResponseBuilder> {
  _$FetchAllInviteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<Invite>? _data;
  ListBuilder<Invite> get data => _$this._data ??= ListBuilder<Invite>();
  set data(ListBuilder<Invite>? data) => _$this._data = data;

  FetchAllInviteResponseBuilder() {
    FetchAllInviteResponse._defaults(this);
  }

  FetchAllInviteResponseBuilder get _$this {
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
  void replace(FetchAllInviteResponse other) {
    _$v = other as _$FetchAllInviteResponse;
  }

  @override
  void update(void Function(FetchAllInviteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FetchAllInviteResponse build() => _build();

  _$FetchAllInviteResponse _build() {
    _$FetchAllInviteResponse _$result;
    try {
      _$result = _$v ??
          _$FetchAllInviteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'FetchAllInviteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'FetchAllInviteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FetchAllInviteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
