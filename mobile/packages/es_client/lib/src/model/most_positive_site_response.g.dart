// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'most_positive_site_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MostPositiveSiteResponse extends MostPositiveSiteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final MostPositiveSiteResponseData data;

  factory _$MostPositiveSiteResponse(
          [void Function(MostPositiveSiteResponseBuilder)? updates]) =>
      (MostPositiveSiteResponseBuilder()..update(updates))._build();

  _$MostPositiveSiteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  MostPositiveSiteResponse rebuild(
          void Function(MostPositiveSiteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MostPositiveSiteResponseBuilder toBuilder() =>
      MostPositiveSiteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MostPositiveSiteResponse &&
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
    return (newBuiltValueToStringHelper(r'MostPositiveSiteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class MostPositiveSiteResponseBuilder
    implements
        Builder<MostPositiveSiteResponse, MostPositiveSiteResponseBuilder> {
  _$MostPositiveSiteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  MostPositiveSiteResponseDataBuilder? _data;
  MostPositiveSiteResponseDataBuilder get data =>
      _$this._data ??= MostPositiveSiteResponseDataBuilder();
  set data(MostPositiveSiteResponseDataBuilder? data) => _$this._data = data;

  MostPositiveSiteResponseBuilder() {
    MostPositiveSiteResponse._defaults(this);
  }

  MostPositiveSiteResponseBuilder get _$this {
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
  void replace(MostPositiveSiteResponse other) {
    _$v = other as _$MostPositiveSiteResponse;
  }

  @override
  void update(void Function(MostPositiveSiteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MostPositiveSiteResponse build() => _build();

  _$MostPositiveSiteResponse _build() {
    _$MostPositiveSiteResponse _$result;
    try {
      _$result = _$v ??
          _$MostPositiveSiteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'MostPositiveSiteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'MostPositiveSiteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MostPositiveSiteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
