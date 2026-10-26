// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_species_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListSpeciesResponse extends ListSpeciesResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SpeciesResponseData> data;

  factory _$ListSpeciesResponse(
          [void Function(ListSpeciesResponseBuilder)? updates]) =>
      (ListSpeciesResponseBuilder()..update(updates))._build();

  _$ListSpeciesResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListSpeciesResponse rebuild(
          void Function(ListSpeciesResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListSpeciesResponseBuilder toBuilder() =>
      ListSpeciesResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListSpeciesResponse &&
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
    return (newBuiltValueToStringHelper(r'ListSpeciesResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListSpeciesResponseBuilder
    implements Builder<ListSpeciesResponse, ListSpeciesResponseBuilder> {
  _$ListSpeciesResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SpeciesResponseData>? _data;
  ListBuilder<SpeciesResponseData> get data =>
      _$this._data ??= ListBuilder<SpeciesResponseData>();
  set data(ListBuilder<SpeciesResponseData>? data) => _$this._data = data;

  ListSpeciesResponseBuilder() {
    ListSpeciesResponse._defaults(this);
  }

  ListSpeciesResponseBuilder get _$this {
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
  void replace(ListSpeciesResponse other) {
    _$v = other as _$ListSpeciesResponse;
  }

  @override
  void update(void Function(ListSpeciesResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListSpeciesResponse build() => _build();

  _$ListSpeciesResponse _build() {
    _$ListSpeciesResponse _$result;
    try {
      _$result = _$v ??
          _$ListSpeciesResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListSpeciesResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListSpeciesResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListSpeciesResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
