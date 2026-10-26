// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'surveillance_type_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SurveillanceTypeResponse extends SurveillanceTypeResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final SurveillanceTypeResponseData data;

  factory _$SurveillanceTypeResponse(
          [void Function(SurveillanceTypeResponseBuilder)? updates]) =>
      (SurveillanceTypeResponseBuilder()..update(updates))._build();

  _$SurveillanceTypeResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SurveillanceTypeResponse rebuild(
          void Function(SurveillanceTypeResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SurveillanceTypeResponseBuilder toBuilder() =>
      SurveillanceTypeResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SurveillanceTypeResponse &&
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
    return (newBuiltValueToStringHelper(r'SurveillanceTypeResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SurveillanceTypeResponseBuilder
    implements
        Builder<SurveillanceTypeResponse, SurveillanceTypeResponseBuilder> {
  _$SurveillanceTypeResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SurveillanceTypeResponseDataBuilder? _data;
  SurveillanceTypeResponseDataBuilder get data =>
      _$this._data ??= SurveillanceTypeResponseDataBuilder();
  set data(SurveillanceTypeResponseDataBuilder? data) => _$this._data = data;

  SurveillanceTypeResponseBuilder() {
    SurveillanceTypeResponse._defaults(this);
  }

  SurveillanceTypeResponseBuilder get _$this {
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
  void replace(SurveillanceTypeResponse other) {
    _$v = other as _$SurveillanceTypeResponse;
  }

  @override
  void update(void Function(SurveillanceTypeResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SurveillanceTypeResponse build() => _build();

  _$SurveillanceTypeResponse _build() {
    _$SurveillanceTypeResponse _$result;
    try {
      _$result = _$v ??
          _$SurveillanceTypeResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SurveillanceTypeResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SurveillanceTypeResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SurveillanceTypeResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
