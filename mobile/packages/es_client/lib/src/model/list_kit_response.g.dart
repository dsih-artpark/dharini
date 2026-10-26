// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_kit_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListKitResponse extends ListKitResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<KitResponseData> data;

  factory _$ListKitResponse([void Function(ListKitResponseBuilder)? updates]) =>
      (ListKitResponseBuilder()..update(updates))._build();

  _$ListKitResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListKitResponse rebuild(void Function(ListKitResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListKitResponseBuilder toBuilder() => ListKitResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListKitResponse &&
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
    return (newBuiltValueToStringHelper(r'ListKitResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListKitResponseBuilder
    implements Builder<ListKitResponse, ListKitResponseBuilder> {
  _$ListKitResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<KitResponseData>? _data;
  ListBuilder<KitResponseData> get data =>
      _$this._data ??= ListBuilder<KitResponseData>();
  set data(ListBuilder<KitResponseData>? data) => _$this._data = data;

  ListKitResponseBuilder() {
    ListKitResponse._defaults(this);
  }

  ListKitResponseBuilder get _$this {
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
  void replace(ListKitResponse other) {
    _$v = other as _$ListKitResponse;
  }

  @override
  void update(void Function(ListKitResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListKitResponse build() => _build();

  _$ListKitResponse _build() {
    _$ListKitResponse _$result;
    try {
      _$result = _$v ??
          _$ListKitResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListKitResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListKitResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListKitResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
