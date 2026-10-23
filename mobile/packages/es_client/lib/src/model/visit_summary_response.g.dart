// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_summary_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitSummaryResponse extends VisitSummaryResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final VisitSummaryResponseData data;

  factory _$VisitSummaryResponse(
          [void Function(VisitSummaryResponseBuilder)? updates]) =>
      (VisitSummaryResponseBuilder()..update(updates))._build();

  _$VisitSummaryResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  VisitSummaryResponse rebuild(
          void Function(VisitSummaryResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitSummaryResponseBuilder toBuilder() =>
      VisitSummaryResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitSummaryResponse &&
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
    return (newBuiltValueToStringHelper(r'VisitSummaryResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class VisitSummaryResponseBuilder
    implements Builder<VisitSummaryResponse, VisitSummaryResponseBuilder> {
  _$VisitSummaryResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  VisitSummaryResponseDataBuilder? _data;
  VisitSummaryResponseDataBuilder get data =>
      _$this._data ??= VisitSummaryResponseDataBuilder();
  set data(VisitSummaryResponseDataBuilder? data) => _$this._data = data;

  VisitSummaryResponseBuilder() {
    VisitSummaryResponse._defaults(this);
  }

  VisitSummaryResponseBuilder get _$this {
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
  void replace(VisitSummaryResponse other) {
    _$v = other as _$VisitSummaryResponse;
  }

  @override
  void update(void Function(VisitSummaryResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitSummaryResponse build() => _build();

  _$VisitSummaryResponse _build() {
    _$VisitSummaryResponse _$result;
    try {
      _$result = _$v ??
          _$VisitSummaryResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'VisitSummaryResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'VisitSummaryResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VisitSummaryResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
