// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validate_barcode_message.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ValidateBarcodeMessage extends ValidateBarcodeMessage {
  @override
  final bool success;
  @override
  final bool isValidBarcode;

  factory _$ValidateBarcodeMessage(
          [void Function(ValidateBarcodeMessageBuilder)? updates]) =>
      (ValidateBarcodeMessageBuilder()..update(updates))._build();

  _$ValidateBarcodeMessage._(
      {required this.success, required this.isValidBarcode})
      : super._();
  @override
  ValidateBarcodeMessage rebuild(
          void Function(ValidateBarcodeMessageBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ValidateBarcodeMessageBuilder toBuilder() =>
      ValidateBarcodeMessageBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ValidateBarcodeMessage &&
        success == other.success &&
        isValidBarcode == other.isValidBarcode;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, isValidBarcode.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ValidateBarcodeMessage')
          ..add('success', success)
          ..add('isValidBarcode', isValidBarcode))
        .toString();
  }
}

class ValidateBarcodeMessageBuilder
    implements Builder<ValidateBarcodeMessage, ValidateBarcodeMessageBuilder> {
  _$ValidateBarcodeMessage? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  bool? _isValidBarcode;
  bool? get isValidBarcode => _$this._isValidBarcode;
  set isValidBarcode(bool? isValidBarcode) =>
      _$this._isValidBarcode = isValidBarcode;

  ValidateBarcodeMessageBuilder() {
    ValidateBarcodeMessage._defaults(this);
  }

  ValidateBarcodeMessageBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _isValidBarcode = $v.isValidBarcode;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ValidateBarcodeMessage other) {
    _$v = other as _$ValidateBarcodeMessage;
  }

  @override
  void update(void Function(ValidateBarcodeMessageBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ValidateBarcodeMessage build() => _build();

  _$ValidateBarcodeMessage _build() {
    final _$result = _$v ??
        _$ValidateBarcodeMessage._(
          success: BuiltValueNullFieldError.checkNotNull(
              success, r'ValidateBarcodeMessage', 'success'),
          isValidBarcode: BuiltValueNullFieldError.checkNotNull(
              isValidBarcode, r'ValidateBarcodeMessage', 'isValidBarcode'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
