// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_break_down_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleBreakDownResponse extends SampleBreakDownResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SampleBreakDownResponseData> data;

  factory _$SampleBreakDownResponse(
          [void Function(SampleBreakDownResponseBuilder)? updates]) =>
      (SampleBreakDownResponseBuilder()..update(updates))._build();

  _$SampleBreakDownResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SampleBreakDownResponse rebuild(
          void Function(SampleBreakDownResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleBreakDownResponseBuilder toBuilder() =>
      SampleBreakDownResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleBreakDownResponse &&
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
    return (newBuiltValueToStringHelper(r'SampleBreakDownResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SampleBreakDownResponseBuilder
    implements
        Builder<SampleBreakDownResponse, SampleBreakDownResponseBuilder> {
  _$SampleBreakDownResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SampleBreakDownResponseData>? _data;
  ListBuilder<SampleBreakDownResponseData> get data =>
      _$this._data ??= ListBuilder<SampleBreakDownResponseData>();
  set data(ListBuilder<SampleBreakDownResponseData>? data) =>
      _$this._data = data;

  SampleBreakDownResponseBuilder() {
    SampleBreakDownResponse._defaults(this);
  }

  SampleBreakDownResponseBuilder get _$this {
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
  void replace(SampleBreakDownResponse other) {
    _$v = other as _$SampleBreakDownResponse;
  }

  @override
  void update(void Function(SampleBreakDownResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleBreakDownResponse build() => _build();

  _$SampleBreakDownResponse _build() {
    _$SampleBreakDownResponse _$result;
    try {
      _$result = _$v ??
          _$SampleBreakDownResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SampleBreakDownResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SampleBreakDownResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleBreakDownResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
