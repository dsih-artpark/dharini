// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_site_on_disease_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$GetSiteOnDiseaseResponse extends GetSiteOnDiseaseResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final GetSiteOnDiseaseResponseData data;

  factory _$GetSiteOnDiseaseResponse(
          [void Function(GetSiteOnDiseaseResponseBuilder)? updates]) =>
      (GetSiteOnDiseaseResponseBuilder()..update(updates))._build();

  _$GetSiteOnDiseaseResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  GetSiteOnDiseaseResponse rebuild(
          void Function(GetSiteOnDiseaseResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  GetSiteOnDiseaseResponseBuilder toBuilder() =>
      GetSiteOnDiseaseResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is GetSiteOnDiseaseResponse &&
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
    return (newBuiltValueToStringHelper(r'GetSiteOnDiseaseResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class GetSiteOnDiseaseResponseBuilder
    implements
        Builder<GetSiteOnDiseaseResponse, GetSiteOnDiseaseResponseBuilder> {
  _$GetSiteOnDiseaseResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  GetSiteOnDiseaseResponseDataBuilder? _data;
  GetSiteOnDiseaseResponseDataBuilder get data =>
      _$this._data ??= GetSiteOnDiseaseResponseDataBuilder();
  set data(GetSiteOnDiseaseResponseDataBuilder? data) => _$this._data = data;

  GetSiteOnDiseaseResponseBuilder() {
    GetSiteOnDiseaseResponse._defaults(this);
  }

  GetSiteOnDiseaseResponseBuilder get _$this {
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
  void replace(GetSiteOnDiseaseResponse other) {
    _$v = other as _$GetSiteOnDiseaseResponse;
  }

  @override
  void update(void Function(GetSiteOnDiseaseResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  GetSiteOnDiseaseResponse build() => _build();

  _$GetSiteOnDiseaseResponse _build() {
    _$GetSiteOnDiseaseResponse _$result;
    try {
      _$result = _$v ??
          _$GetSiteOnDiseaseResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'GetSiteOnDiseaseResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'GetSiteOnDiseaseResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'GetSiteOnDiseaseResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
