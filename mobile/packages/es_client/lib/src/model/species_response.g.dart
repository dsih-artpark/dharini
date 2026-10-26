// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'species_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SpeciesResponse extends SpeciesResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final SpeciesResponseData data;

  factory _$SpeciesResponse([void Function(SpeciesResponseBuilder)? updates]) =>
      (SpeciesResponseBuilder()..update(updates))._build();

  _$SpeciesResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SpeciesResponse rebuild(void Function(SpeciesResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SpeciesResponseBuilder toBuilder() => SpeciesResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SpeciesResponse &&
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
    return (newBuiltValueToStringHelper(r'SpeciesResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SpeciesResponseBuilder
    implements Builder<SpeciesResponse, SpeciesResponseBuilder> {
  _$SpeciesResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SpeciesResponseDataBuilder? _data;
  SpeciesResponseDataBuilder get data =>
      _$this._data ??= SpeciesResponseDataBuilder();
  set data(SpeciesResponseDataBuilder? data) => _$this._data = data;

  SpeciesResponseBuilder() {
    SpeciesResponse._defaults(this);
  }

  SpeciesResponseBuilder get _$this {
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
  void replace(SpeciesResponse other) {
    _$v = other as _$SpeciesResponse;
  }

  @override
  void update(void Function(SpeciesResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SpeciesResponse build() => _build();

  _$SpeciesResponse _build() {
    _$SpeciesResponse _$result;
    try {
      _$result = _$v ??
          _$SpeciesResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SpeciesResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SpeciesResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SpeciesResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
