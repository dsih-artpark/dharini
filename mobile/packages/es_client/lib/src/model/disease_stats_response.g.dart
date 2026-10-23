// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'disease_stats_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$DiseaseStatsResponse extends DiseaseStatsResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final DiseaseStatsResponseData data;

  factory _$DiseaseStatsResponse(
          [void Function(DiseaseStatsResponseBuilder)? updates]) =>
      (DiseaseStatsResponseBuilder()..update(updates))._build();

  _$DiseaseStatsResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  DiseaseStatsResponse rebuild(
          void Function(DiseaseStatsResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  DiseaseStatsResponseBuilder toBuilder() =>
      DiseaseStatsResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is DiseaseStatsResponse &&
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
    return (newBuiltValueToStringHelper(r'DiseaseStatsResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class DiseaseStatsResponseBuilder
    implements Builder<DiseaseStatsResponse, DiseaseStatsResponseBuilder> {
  _$DiseaseStatsResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  DiseaseStatsResponseDataBuilder? _data;
  DiseaseStatsResponseDataBuilder get data =>
      _$this._data ??= DiseaseStatsResponseDataBuilder();
  set data(DiseaseStatsResponseDataBuilder? data) => _$this._data = data;

  DiseaseStatsResponseBuilder() {
    DiseaseStatsResponse._defaults(this);
  }

  DiseaseStatsResponseBuilder get _$this {
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
  void replace(DiseaseStatsResponse other) {
    _$v = other as _$DiseaseStatsResponse;
  }

  @override
  void update(void Function(DiseaseStatsResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  DiseaseStatsResponse build() => _build();

  _$DiseaseStatsResponse _build() {
    _$DiseaseStatsResponse _$result;
    try {
      _$result = _$v ??
          _$DiseaseStatsResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'DiseaseStatsResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'DiseaseStatsResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'DiseaseStatsResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
