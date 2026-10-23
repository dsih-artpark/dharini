// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_location_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListLocationResponse extends ListLocationResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<LocationResponseData> data;

  factory _$ListLocationResponse(
          [void Function(ListLocationResponseBuilder)? updates]) =>
      (ListLocationResponseBuilder()..update(updates))._build();

  _$ListLocationResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListLocationResponse rebuild(
          void Function(ListLocationResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListLocationResponseBuilder toBuilder() =>
      ListLocationResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListLocationResponse &&
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
    return (newBuiltValueToStringHelper(r'ListLocationResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListLocationResponseBuilder
    implements Builder<ListLocationResponse, ListLocationResponseBuilder> {
  _$ListLocationResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<LocationResponseData>? _data;
  ListBuilder<LocationResponseData> get data =>
      _$this._data ??= ListBuilder<LocationResponseData>();
  set data(ListBuilder<LocationResponseData>? data) => _$this._data = data;

  ListLocationResponseBuilder() {
    ListLocationResponse._defaults(this);
  }

  ListLocationResponseBuilder get _$this {
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
  void replace(ListLocationResponse other) {
    _$v = other as _$ListLocationResponse;
  }

  @override
  void update(void Function(ListLocationResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListLocationResponse build() => _build();

  _$ListLocationResponse _build() {
    _$ListLocationResponse _$result;
    try {
      _$result = _$v ??
          _$ListLocationResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListLocationResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListLocationResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListLocationResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
