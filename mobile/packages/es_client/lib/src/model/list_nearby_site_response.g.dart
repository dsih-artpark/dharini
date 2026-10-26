// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_nearby_site_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListNearbySiteResponse extends ListNearbySiteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<NearbySiteResponseData> data;

  factory _$ListNearbySiteResponse(
          [void Function(ListNearbySiteResponseBuilder)? updates]) =>
      (ListNearbySiteResponseBuilder()..update(updates))._build();

  _$ListNearbySiteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListNearbySiteResponse rebuild(
          void Function(ListNearbySiteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListNearbySiteResponseBuilder toBuilder() =>
      ListNearbySiteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListNearbySiteResponse &&
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
    return (newBuiltValueToStringHelper(r'ListNearbySiteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListNearbySiteResponseBuilder
    implements Builder<ListNearbySiteResponse, ListNearbySiteResponseBuilder> {
  _$ListNearbySiteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<NearbySiteResponseData>? _data;
  ListBuilder<NearbySiteResponseData> get data =>
      _$this._data ??= ListBuilder<NearbySiteResponseData>();
  set data(ListBuilder<NearbySiteResponseData>? data) => _$this._data = data;

  ListNearbySiteResponseBuilder() {
    ListNearbySiteResponse._defaults(this);
  }

  ListNearbySiteResponseBuilder get _$this {
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
  void replace(ListNearbySiteResponse other) {
    _$v = other as _$ListNearbySiteResponse;
  }

  @override
  void update(void Function(ListNearbySiteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListNearbySiteResponse build() => _build();

  _$ListNearbySiteResponse _build() {
    _$ListNearbySiteResponse _$result;
    try {
      _$result = _$v ??
          _$ListNearbySiteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListNearbySiteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListNearbySiteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListNearbySiteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
