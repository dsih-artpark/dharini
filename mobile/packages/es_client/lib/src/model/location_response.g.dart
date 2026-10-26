// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'location_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LocationResponse extends LocationResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final LocationResponseData data;

  factory _$LocationResponse(
          [void Function(LocationResponseBuilder)? updates]) =>
      (LocationResponseBuilder()..update(updates))._build();

  _$LocationResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  LocationResponse rebuild(void Function(LocationResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LocationResponseBuilder toBuilder() =>
      LocationResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LocationResponse &&
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
    return (newBuiltValueToStringHelper(r'LocationResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class LocationResponseBuilder
    implements Builder<LocationResponse, LocationResponseBuilder> {
  _$LocationResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  LocationResponseDataBuilder? _data;
  LocationResponseDataBuilder get data =>
      _$this._data ??= LocationResponseDataBuilder();
  set data(LocationResponseDataBuilder? data) => _$this._data = data;

  LocationResponseBuilder() {
    LocationResponse._defaults(this);
  }

  LocationResponseBuilder get _$this {
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
  void replace(LocationResponse other) {
    _$v = other as _$LocationResponse;
  }

  @override
  void update(void Function(LocationResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LocationResponse build() => _build();

  _$LocationResponse _build() {
    _$LocationResponse _$result;
    try {
      _$result = _$v ??
          _$LocationResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'LocationResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'LocationResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LocationResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
