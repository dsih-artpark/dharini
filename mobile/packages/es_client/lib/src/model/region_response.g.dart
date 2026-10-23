// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'region_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RegionResponse extends RegionResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final RegionResponseData data;

  factory _$RegionResponse([void Function(RegionResponseBuilder)? updates]) =>
      (RegionResponseBuilder()..update(updates))._build();

  _$RegionResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  RegionResponse rebuild(void Function(RegionResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RegionResponseBuilder toBuilder() => RegionResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RegionResponse &&
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
    return (newBuiltValueToStringHelper(r'RegionResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class RegionResponseBuilder
    implements Builder<RegionResponse, RegionResponseBuilder> {
  _$RegionResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  RegionResponseDataBuilder? _data;
  RegionResponseDataBuilder get data =>
      _$this._data ??= RegionResponseDataBuilder();
  set data(RegionResponseDataBuilder? data) => _$this._data = data;

  RegionResponseBuilder() {
    RegionResponse._defaults(this);
  }

  RegionResponseBuilder get _$this {
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
  void replace(RegionResponse other) {
    _$v = other as _$RegionResponse;
  }

  @override
  void update(void Function(RegionResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RegionResponse build() => _build();

  _$RegionResponse _build() {
    _$RegionResponse _$result;
    try {
      _$result = _$v ??
          _$RegionResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'RegionResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'RegionResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RegionResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
