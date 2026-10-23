// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_disease_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListDiseaseResponse extends ListDiseaseResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<DiseaseResponseData> data;

  factory _$ListDiseaseResponse(
          [void Function(ListDiseaseResponseBuilder)? updates]) =>
      (ListDiseaseResponseBuilder()..update(updates))._build();

  _$ListDiseaseResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListDiseaseResponse rebuild(
          void Function(ListDiseaseResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListDiseaseResponseBuilder toBuilder() =>
      ListDiseaseResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListDiseaseResponse &&
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
    return (newBuiltValueToStringHelper(r'ListDiseaseResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListDiseaseResponseBuilder
    implements Builder<ListDiseaseResponse, ListDiseaseResponseBuilder> {
  _$ListDiseaseResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<DiseaseResponseData>? _data;
  ListBuilder<DiseaseResponseData> get data =>
      _$this._data ??= ListBuilder<DiseaseResponseData>();
  set data(ListBuilder<DiseaseResponseData>? data) => _$this._data = data;

  ListDiseaseResponseBuilder() {
    ListDiseaseResponse._defaults(this);
  }

  ListDiseaseResponseBuilder get _$this {
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
  void replace(ListDiseaseResponse other) {
    _$v = other as _$ListDiseaseResponse;
  }

  @override
  void update(void Function(ListDiseaseResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListDiseaseResponse build() => _build();

  _$ListDiseaseResponse _build() {
    _$ListDiseaseResponse _$result;
    try {
      _$result = _$v ??
          _$ListDiseaseResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListDiseaseResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListDiseaseResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListDiseaseResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
