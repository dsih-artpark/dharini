// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_script_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleScriptResponseData extends SampleScriptResponseData {
  @override
  final bool success;
  @override
  final String message;

  factory _$SampleScriptResponseData(
          [void Function(SampleScriptResponseDataBuilder)? updates]) =>
      (SampleScriptResponseDataBuilder()..update(updates))._build();

  _$SampleScriptResponseData._({required this.success, required this.message})
      : super._();
  @override
  SampleScriptResponseData rebuild(
          void Function(SampleScriptResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleScriptResponseDataBuilder toBuilder() =>
      SampleScriptResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleScriptResponseData &&
        success == other.success &&
        message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleScriptResponseData')
          ..add('success', success)
          ..add('message', message))
        .toString();
  }
}

class SampleScriptResponseDataBuilder
    implements
        Builder<SampleScriptResponseData, SampleScriptResponseDataBuilder> {
  _$SampleScriptResponseData? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SampleScriptResponseDataBuilder() {
    SampleScriptResponseData._defaults(this);
  }

  SampleScriptResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleScriptResponseData other) {
    _$v = other as _$SampleScriptResponseData;
  }

  @override
  void update(void Function(SampleScriptResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleScriptResponseData build() => _build();

  _$SampleScriptResponseData _build() {
    final _$result = _$v ??
        _$SampleScriptResponseData._(
          success: BuiltValueNullFieldError.checkNotNull(
              success, r'SampleScriptResponseData', 'success'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'SampleScriptResponseData', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
