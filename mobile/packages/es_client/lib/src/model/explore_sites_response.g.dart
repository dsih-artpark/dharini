// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'explore_sites_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ExploreSitesResponse extends ExploreSitesResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final ExploreSiteData data;

  factory _$ExploreSitesResponse(
          [void Function(ExploreSitesResponseBuilder)? updates]) =>
      (ExploreSitesResponseBuilder()..update(updates))._build();

  _$ExploreSitesResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ExploreSitesResponse rebuild(
          void Function(ExploreSitesResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ExploreSitesResponseBuilder toBuilder() =>
      ExploreSitesResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ExploreSitesResponse &&
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
    return (newBuiltValueToStringHelper(r'ExploreSitesResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ExploreSitesResponseBuilder
    implements Builder<ExploreSitesResponse, ExploreSitesResponseBuilder> {
  _$ExploreSitesResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ExploreSiteDataBuilder? _data;
  ExploreSiteDataBuilder get data => _$this._data ??= ExploreSiteDataBuilder();
  set data(ExploreSiteDataBuilder? data) => _$this._data = data;

  ExploreSitesResponseBuilder() {
    ExploreSitesResponse._defaults(this);
  }

  ExploreSitesResponseBuilder get _$this {
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
  void replace(ExploreSitesResponse other) {
    _$v = other as _$ExploreSitesResponse;
  }

  @override
  void update(void Function(ExploreSitesResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ExploreSitesResponse build() => _build();

  _$ExploreSitesResponse _build() {
    _$ExploreSitesResponse _$result;
    try {
      _$result = _$v ??
          _$ExploreSitesResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ExploreSitesResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ExploreSitesResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ExploreSitesResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
