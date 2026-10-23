// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_animal_metadata_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListAnimalMetadataResponse extends ListAnimalMetadataResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<AnimalMetadataData> data;

  factory _$ListAnimalMetadataResponse(
          [void Function(ListAnimalMetadataResponseBuilder)? updates]) =>
      (ListAnimalMetadataResponseBuilder()..update(updates))._build();

  _$ListAnimalMetadataResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListAnimalMetadataResponse rebuild(
          void Function(ListAnimalMetadataResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListAnimalMetadataResponseBuilder toBuilder() =>
      ListAnimalMetadataResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListAnimalMetadataResponse &&
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
    return (newBuiltValueToStringHelper(r'ListAnimalMetadataResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListAnimalMetadataResponseBuilder
    implements
        Builder<ListAnimalMetadataResponse, ListAnimalMetadataResponseBuilder> {
  _$ListAnimalMetadataResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<AnimalMetadataData>? _data;
  ListBuilder<AnimalMetadataData> get data =>
      _$this._data ??= ListBuilder<AnimalMetadataData>();
  set data(ListBuilder<AnimalMetadataData>? data) => _$this._data = data;

  ListAnimalMetadataResponseBuilder() {
    ListAnimalMetadataResponse._defaults(this);
  }

  ListAnimalMetadataResponseBuilder get _$this {
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
  void replace(ListAnimalMetadataResponse other) {
    _$v = other as _$ListAnimalMetadataResponse;
  }

  @override
  void update(void Function(ListAnimalMetadataResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListAnimalMetadataResponse build() => _build();

  _$ListAnimalMetadataResponse _build() {
    _$ListAnimalMetadataResponse _$result;
    try {
      _$result = _$v ??
          _$ListAnimalMetadataResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListAnimalMetadataResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListAnimalMetadataResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListAnimalMetadataResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
