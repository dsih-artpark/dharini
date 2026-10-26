// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_lab_test_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListLabTestResponse extends ListLabTestResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<LabTestResponseData> data;

  factory _$ListLabTestResponse(
          [void Function(ListLabTestResponseBuilder)? updates]) =>
      (ListLabTestResponseBuilder()..update(updates))._build();

  _$ListLabTestResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListLabTestResponse rebuild(
          void Function(ListLabTestResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListLabTestResponseBuilder toBuilder() =>
      ListLabTestResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListLabTestResponse &&
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
    return (newBuiltValueToStringHelper(r'ListLabTestResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListLabTestResponseBuilder
    implements Builder<ListLabTestResponse, ListLabTestResponseBuilder> {
  _$ListLabTestResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<LabTestResponseData>? _data;
  ListBuilder<LabTestResponseData> get data =>
      _$this._data ??= ListBuilder<LabTestResponseData>();
  set data(ListBuilder<LabTestResponseData>? data) => _$this._data = data;

  ListLabTestResponseBuilder() {
    ListLabTestResponse._defaults(this);
  }

  ListLabTestResponseBuilder get _$this {
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
  void replace(ListLabTestResponse other) {
    _$v = other as _$ListLabTestResponse;
  }

  @override
  void update(void Function(ListLabTestResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListLabTestResponse build() => _build();

  _$ListLabTestResponse _build() {
    _$ListLabTestResponse _$result;
    try {
      _$result = _$v ??
          _$ListLabTestResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListLabTestResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListLabTestResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListLabTestResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
