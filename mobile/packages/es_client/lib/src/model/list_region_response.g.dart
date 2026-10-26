// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_region_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListRegionResponse extends ListRegionResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<RegionResponseData> data;

  factory _$ListRegionResponse(
          [void Function(ListRegionResponseBuilder)? updates]) =>
      (ListRegionResponseBuilder()..update(updates))._build();

  _$ListRegionResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListRegionResponse rebuild(
          void Function(ListRegionResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListRegionResponseBuilder toBuilder() =>
      ListRegionResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListRegionResponse &&
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
    return (newBuiltValueToStringHelper(r'ListRegionResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListRegionResponseBuilder
    implements Builder<ListRegionResponse, ListRegionResponseBuilder> {
  _$ListRegionResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<RegionResponseData>? _data;
  ListBuilder<RegionResponseData> get data =>
      _$this._data ??= ListBuilder<RegionResponseData>();
  set data(ListBuilder<RegionResponseData>? data) => _$this._data = data;

  ListRegionResponseBuilder() {
    ListRegionResponse._defaults(this);
  }

  ListRegionResponseBuilder get _$this {
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
  void replace(ListRegionResponse other) {
    _$v = other as _$ListRegionResponse;
  }

  @override
  void update(void Function(ListRegionResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListRegionResponse build() => _build();

  _$ListRegionResponse _build() {
    _$ListRegionResponse _$result;
    try {
      _$result = _$v ??
          _$ListRegionResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListRegionResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListRegionResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListRegionResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
