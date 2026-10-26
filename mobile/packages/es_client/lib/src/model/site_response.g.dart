// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SiteResponse extends SiteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final SiteResponseData data;

  factory _$SiteResponse([void Function(SiteResponseBuilder)? updates]) =>
      (SiteResponseBuilder()..update(updates))._build();

  _$SiteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  SiteResponse rebuild(void Function(SiteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteResponseBuilder toBuilder() => SiteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SiteResponse &&
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
    return (newBuiltValueToStringHelper(r'SiteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class SiteResponseBuilder
    implements Builder<SiteResponse, SiteResponseBuilder> {
  _$SiteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SiteResponseDataBuilder? _data;
  SiteResponseDataBuilder get data =>
      _$this._data ??= SiteResponseDataBuilder();
  set data(SiteResponseDataBuilder? data) => _$this._data = data;

  SiteResponseBuilder() {
    SiteResponse._defaults(this);
  }

  SiteResponseBuilder get _$this {
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
  void replace(SiteResponse other) {
    _$v = other as _$SiteResponse;
  }

  @override
  void update(void Function(SiteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SiteResponse build() => _build();

  _$SiteResponse _build() {
    _$SiteResponse _$result;
    try {
      _$result = _$v ??
          _$SiteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'SiteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'SiteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SiteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
