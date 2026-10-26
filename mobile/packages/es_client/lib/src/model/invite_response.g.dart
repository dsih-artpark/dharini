// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invite_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InviteResponse extends InviteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final Invite data;

  factory _$InviteResponse([void Function(InviteResponseBuilder)? updates]) =>
      (InviteResponseBuilder()..update(updates))._build();

  _$InviteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  InviteResponse rebuild(void Function(InviteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InviteResponseBuilder toBuilder() => InviteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InviteResponse &&
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
    return (newBuiltValueToStringHelper(r'InviteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class InviteResponseBuilder
    implements Builder<InviteResponse, InviteResponseBuilder> {
  _$InviteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  InviteBuilder? _data;
  InviteBuilder get data => _$this._data ??= InviteBuilder();
  set data(InviteBuilder? data) => _$this._data = data;

  InviteResponseBuilder() {
    InviteResponse._defaults(this);
  }

  InviteResponseBuilder get _$this {
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
  void replace(InviteResponse other) {
    _$v = other as _$InviteResponse;
  }

  @override
  void update(void Function(InviteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InviteResponse build() => _build();

  _$InviteResponse _build() {
    _$InviteResponse _$result;
    try {
      _$result = _$v ??
          _$InviteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'InviteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'InviteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'InviteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
