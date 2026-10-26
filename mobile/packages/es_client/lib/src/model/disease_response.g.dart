// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseResponse extends DiseaseResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final DiseaseResponseData data;

  factory _$DiseaseResponse([void Function(DiseaseResponseBuilder)? updates]) =>
      (DiseaseResponseBuilder()..update(updates))._build();

  _$DiseaseResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  DiseaseResponse rebuild(void Function(DiseaseResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseResponseBuilder toBuilder() => DiseaseResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseResponse &&
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
    return (newBuiltValueToStringHelper(r'DiseaseResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class DiseaseResponseBuilder
    implements Builder<DiseaseResponse, DiseaseResponseBuilder> {
  _$DiseaseResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  DiseaseResponseDataBuilder? _data;
  DiseaseResponseDataBuilder get data =>
      _$this._data ??= DiseaseResponseDataBuilder();
  set data(DiseaseResponseDataBuilder? data) => _$this._data = data;

  DiseaseResponseBuilder() {
    DiseaseResponse._defaults(this);
  }

  DiseaseResponseBuilder get _$this {
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
  void replace(DiseaseResponse other) {
    _$v = other as _$DiseaseResponse;
  }

  @override
  void update(void Function(DiseaseResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseResponse build() => _build();

  _$DiseaseResponse _build() {
    _$DiseaseResponse _$result;
    try {
      _$result = _$v ??
          _$DiseaseResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'DiseaseResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'DiseaseResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
