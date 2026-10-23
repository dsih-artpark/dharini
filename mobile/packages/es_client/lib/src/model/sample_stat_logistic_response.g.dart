// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_stat_logistic_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleStatLogisticResponse extends SampleStatLogisticResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SampleStatLogisticResponseData> data;

  factory _$SampleStatLogisticResponse(
          [void Function(SampleStatLogisticResponseBuilder)? updates]) =>
      (SampleStatLogisticResponseBuilder()..update(updates))._build();

  _$SampleStatLogisticResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SampleStatLogisticResponse rebuild(
          void Function(SampleStatLogisticResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleStatLogisticResponseBuilder toBuilder() =>
      SampleStatLogisticResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleStatLogisticResponse &&
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
    return (newBuiltValueToStringHelper(r'SampleStatLogisticResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SampleStatLogisticResponseBuilder
    implements
        Builder<SampleStatLogisticResponse, SampleStatLogisticResponseBuilder> {
  _$SampleStatLogisticResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SampleStatLogisticResponseData>? _data;
  ListBuilder<SampleStatLogisticResponseData> get data =>
      _$this._data ??= ListBuilder<SampleStatLogisticResponseData>();
  set data(ListBuilder<SampleStatLogisticResponseData>? data) =>
      _$this._data = data;

  SampleStatLogisticResponseBuilder() {
    SampleStatLogisticResponse._defaults(this);
  }

  SampleStatLogisticResponseBuilder get _$this {
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
  void replace(SampleStatLogisticResponse other) {
    _$v = other as _$SampleStatLogisticResponse;
  }

  @override
  void update(void Function(SampleStatLogisticResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleStatLogisticResponse build() => _build();

  _$SampleStatLogisticResponse _build() {
    _$SampleStatLogisticResponse _$result;
    try {
      _$result = _$v ??
          _$SampleStatLogisticResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SampleStatLogisticResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SampleStatLogisticResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleStatLogisticResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
