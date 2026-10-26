// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_type_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleTypeResponse extends SampleTypeResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final SampleTypeResponseData data;

  factory _$SampleTypeResponse(
          [void Function(SampleTypeResponseBuilder)? updates]) =>
      (SampleTypeResponseBuilder()..update(updates))._build();

  _$SampleTypeResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SampleTypeResponse rebuild(
          void Function(SampleTypeResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleTypeResponseBuilder toBuilder() =>
      SampleTypeResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleTypeResponse &&
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
    return (newBuiltValueToStringHelper(r'SampleTypeResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SampleTypeResponseBuilder
    implements Builder<SampleTypeResponse, SampleTypeResponseBuilder> {
  _$SampleTypeResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SampleTypeResponseDataBuilder? _data;
  SampleTypeResponseDataBuilder get data =>
      _$this._data ??= SampleTypeResponseDataBuilder();
  set data(SampleTypeResponseDataBuilder? data) => _$this._data = data;

  SampleTypeResponseBuilder() {
    SampleTypeResponse._defaults(this);
  }

  SampleTypeResponseBuilder get _$this {
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
  void replace(SampleTypeResponse other) {
    _$v = other as _$SampleTypeResponse;
  }

  @override
  void update(void Function(SampleTypeResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleTypeResponse build() => _build();

  _$SampleTypeResponse _build() {
    _$SampleTypeResponse _$result;
    try {
      _$result = _$v ??
          _$SampleTypeResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SampleTypeResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SampleTypeResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleTypeResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
