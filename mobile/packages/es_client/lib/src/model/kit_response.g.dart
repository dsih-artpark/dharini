// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'kit_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$KitResponse extends KitResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final KitResponseData data;

  factory _$KitResponse([void Function(KitResponseBuilder)? updates]) =>
      (KitResponseBuilder()..update(updates))._build();

  _$KitResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  KitResponse rebuild(void Function(KitResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  KitResponseBuilder toBuilder() => KitResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is KitResponse &&
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
    return (newBuiltValueToStringHelper(r'KitResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class KitResponseBuilder implements Builder<KitResponse, KitResponseBuilder> {
  _$KitResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  KitResponseDataBuilder? _data;
  KitResponseDataBuilder get data => _$this._data ??= KitResponseDataBuilder();
  set data(KitResponseDataBuilder? data) => _$this._data = data;

  KitResponseBuilder() {
    KitResponse._defaults(this);
  }

  KitResponseBuilder get _$this {
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
  void replace(KitResponse other) {
    _$v = other as _$KitResponse;
  }

  @override
  void update(void Function(KitResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  KitResponse build() => _build();

  _$KitResponse _build() {
    _$KitResponse _$result;
    try {
      _$result = _$v ??
          _$KitResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'KitResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'KitResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'KitResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
