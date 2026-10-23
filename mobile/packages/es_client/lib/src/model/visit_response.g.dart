// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitResponse extends VisitResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final VisitResponseData data;

  factory _$VisitResponse([void Function(VisitResponseBuilder)? updates]) =>
      (VisitResponseBuilder()..update(updates))._build();

  _$VisitResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  VisitResponse rebuild(void Function(VisitResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitResponseBuilder toBuilder() => VisitResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitResponse &&
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
    return (newBuiltValueToStringHelper(r'VisitResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class VisitResponseBuilder
    implements Builder<VisitResponse, VisitResponseBuilder> {
  _$VisitResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  VisitResponseDataBuilder? _data;
  VisitResponseDataBuilder get data =>
      _$this._data ??= VisitResponseDataBuilder();
  set data(VisitResponseDataBuilder? data) => _$this._data = data;

  VisitResponseBuilder() {
    VisitResponse._defaults(this);
  }

  VisitResponseBuilder get _$this {
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
  void replace(VisitResponse other) {
    _$v = other as _$VisitResponse;
  }

  @override
  void update(void Function(VisitResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitResponse build() => _build();

  _$VisitResponse _build() {
    _$VisitResponse _$result;
    try {
      _$result = _$v ??
          _$VisitResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'VisitResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'VisitResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VisitResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
