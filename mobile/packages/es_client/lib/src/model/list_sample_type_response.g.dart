// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_sample_type_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListSampleTypeResponse extends ListSampleTypeResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SampleTypeResponseData> data;

  factory _$ListSampleTypeResponse(
          [void Function(ListSampleTypeResponseBuilder)? updates]) =>
      (ListSampleTypeResponseBuilder()..update(updates))._build();

  _$ListSampleTypeResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListSampleTypeResponse rebuild(
          void Function(ListSampleTypeResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListSampleTypeResponseBuilder toBuilder() =>
      ListSampleTypeResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListSampleTypeResponse &&
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
    return (newBuiltValueToStringHelper(r'ListSampleTypeResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListSampleTypeResponseBuilder
    implements Builder<ListSampleTypeResponse, ListSampleTypeResponseBuilder> {
  _$ListSampleTypeResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SampleTypeResponseData>? _data;
  ListBuilder<SampleTypeResponseData> get data =>
      _$this._data ??= ListBuilder<SampleTypeResponseData>();
  set data(ListBuilder<SampleTypeResponseData>? data) => _$this._data = data;

  ListSampleTypeResponseBuilder() {
    ListSampleTypeResponse._defaults(this);
  }

  ListSampleTypeResponseBuilder get _$this {
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
  void replace(ListSampleTypeResponse other) {
    _$v = other as _$ListSampleTypeResponse;
  }

  @override
  void update(void Function(ListSampleTypeResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListSampleTypeResponse build() => _build();

  _$ListSampleTypeResponse _build() {
    _$ListSampleTypeResponse _$result;
    try {
      _$result = _$v ??
          _$ListSampleTypeResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListSampleTypeResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListSampleTypeResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListSampleTypeResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
