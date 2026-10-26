// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleResponse extends SampleResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final SampleResponseData data;

  factory _$SampleResponse([void Function(SampleResponseBuilder)? updates]) =>
      (SampleResponseBuilder()..update(updates))._build();

  _$SampleResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SampleResponse rebuild(void Function(SampleResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleResponseBuilder toBuilder() => SampleResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleResponse &&
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
    return (newBuiltValueToStringHelper(r'SampleResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SampleResponseBuilder
    implements Builder<SampleResponse, SampleResponseBuilder> {
  _$SampleResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SampleResponseDataBuilder? _data;
  SampleResponseDataBuilder get data =>
      _$this._data ??= SampleResponseDataBuilder();
  set data(SampleResponseDataBuilder? data) => _$this._data = data;

  SampleResponseBuilder() {
    SampleResponse._defaults(this);
  }

  SampleResponseBuilder get _$this {
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
  void replace(SampleResponse other) {
    _$v = other as _$SampleResponse;
  }

  @override
  void update(void Function(SampleResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleResponse build() => _build();

  _$SampleResponse _build() {
    _$SampleResponse _$result;
    try {
      _$result = _$v ??
          _$SampleResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SampleResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SampleResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
