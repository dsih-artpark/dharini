// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'fetch_all_lab_test_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FetchAllLabTestResponse extends FetchAllLabTestResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<LabTestResponseDto> data;

  factory _$FetchAllLabTestResponse(
          [void Function(FetchAllLabTestResponseBuilder)? updates]) =>
      (FetchAllLabTestResponseBuilder()..update(updates))._build();

  _$FetchAllLabTestResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  FetchAllLabTestResponse rebuild(
          void Function(FetchAllLabTestResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FetchAllLabTestResponseBuilder toBuilder() =>
      FetchAllLabTestResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FetchAllLabTestResponse &&
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
    return (newBuiltValueToStringHelper(r'FetchAllLabTestResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class FetchAllLabTestResponseBuilder
    implements
        Builder<FetchAllLabTestResponse, FetchAllLabTestResponseBuilder> {
  _$FetchAllLabTestResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<LabTestResponseDto>? _data;
  ListBuilder<LabTestResponseDto> get data =>
      _$this._data ??= ListBuilder<LabTestResponseDto>();
  set data(ListBuilder<LabTestResponseDto>? data) => _$this._data = data;

  FetchAllLabTestResponseBuilder() {
    FetchAllLabTestResponse._defaults(this);
  }

  FetchAllLabTestResponseBuilder get _$this {
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
  void replace(FetchAllLabTestResponse other) {
    _$v = other as _$FetchAllLabTestResponse;
  }

  @override
  void update(void Function(FetchAllLabTestResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FetchAllLabTestResponse build() => _build();

  _$FetchAllLabTestResponse _build() {
    _$FetchAllLabTestResponse _$result;
    try {
      _$result = _$v ??
          _$FetchAllLabTestResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'FetchAllLabTestResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'FetchAllLabTestResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FetchAllLabTestResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
