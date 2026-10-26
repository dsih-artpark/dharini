// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'convert_excel_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ConvertExcelResponse extends ConvertExcelResponse {
  @override
  final bool success;
  @override
  final String message;

  factory _$ConvertExcelResponse(
          [void Function(ConvertExcelResponseBuilder)? updates]) =>
      (ConvertExcelResponseBuilder()..update(updates))._build();

  _$ConvertExcelResponse._({required this.success, required this.message})
      : super._();
  @override
  ConvertExcelResponse rebuild(
          void Function(ConvertExcelResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ConvertExcelResponseBuilder toBuilder() =>
      ConvertExcelResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ConvertExcelResponse &&
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
    return (newBuiltValueToStringHelper(r'ConvertExcelResponse')
          ..add('success', success)
          ..add('message', message))
        .toString();
  }
}

class ConvertExcelResponseBuilder
    implements Builder<ConvertExcelResponse, ConvertExcelResponseBuilder> {
  _$ConvertExcelResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ConvertExcelResponseBuilder() {
    ConvertExcelResponse._defaults(this);
  }

  ConvertExcelResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ConvertExcelResponse other) {
    _$v = other as _$ConvertExcelResponse;
  }

  @override
  void update(void Function(ConvertExcelResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ConvertExcelResponse build() => _build();

  _$ConvertExcelResponse _build() {
    final _$result = _$v ??
        _$ConvertExcelResponse._(
          success: BuiltValueNullFieldError.checkNotNull(
              success, r'ConvertExcelResponse', 'success'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'ConvertExcelResponse', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
