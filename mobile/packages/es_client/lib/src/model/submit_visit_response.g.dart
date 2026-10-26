// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'submit_visit_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SubmitVisitResponse extends SubmitVisitResponse {
  @override
  final bool success;
  @override
  final String message;

  factory _$SubmitVisitResponse(
          [void Function(SubmitVisitResponseBuilder)? updates]) =>
      (SubmitVisitResponseBuilder()..update(updates))._build();

  _$SubmitVisitResponse._({required this.success, required this.message})
      : super._();
  @override
  SubmitVisitResponse rebuild(
          void Function(SubmitVisitResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SubmitVisitResponseBuilder toBuilder() =>
      SubmitVisitResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SubmitVisitResponse &&
        success == other.success &&
        message == other.message;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SubmitVisitResponse')
          ..add('success', success)
          ..add('message', message))
        .toString();
  }
}

class SubmitVisitResponseBuilder
    implements Builder<SubmitVisitResponse, SubmitVisitResponseBuilder> {
  _$SubmitVisitResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  SubmitVisitResponseBuilder() {
    SubmitVisitResponse._defaults(this);
  }

  SubmitVisitResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SubmitVisitResponse other) {
    _$v = other as _$SubmitVisitResponse;
  }

  @override
  void update(void Function(SubmitVisitResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SubmitVisitResponse build() => _build();

  _$SubmitVisitResponse _build() {
    final _$result = _$v ??
        _$SubmitVisitResponse._(
          success: BuiltValueNullFieldError.checkNotNull(
              success, r'SubmitVisitResponse', 'success'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'SubmitVisitResponse', 'message'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
