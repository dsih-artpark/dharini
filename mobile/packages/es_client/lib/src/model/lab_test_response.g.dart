// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lab_test_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LabTestResponse extends LabTestResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final LabTestResponseData data;

  factory _$LabTestResponse([void Function(LabTestResponseBuilder)? updates]) =>
      (LabTestResponseBuilder()..update(updates))._build();

  _$LabTestResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  LabTestResponse rebuild(void Function(LabTestResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LabTestResponseBuilder toBuilder() => LabTestResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LabTestResponse &&
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
    return (newBuiltValueToStringHelper(r'LabTestResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class LabTestResponseBuilder
    implements Builder<LabTestResponse, LabTestResponseBuilder> {
  _$LabTestResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  LabTestResponseDataBuilder? _data;
  LabTestResponseDataBuilder get data =>
      _$this._data ??= LabTestResponseDataBuilder();
  set data(LabTestResponseDataBuilder? data) => _$this._data = data;

  LabTestResponseBuilder() {
    LabTestResponse._defaults(this);
  }

  LabTestResponseBuilder get _$this {
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
  void replace(LabTestResponse other) {
    _$v = other as _$LabTestResponse;
  }

  @override
  void update(void Function(LabTestResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LabTestResponse build() => _build();

  _$LabTestResponse _build() {
    _$LabTestResponse _$result;
    try {
      _$result = _$v ??
          _$LabTestResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'LabTestResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'LabTestResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LabTestResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
