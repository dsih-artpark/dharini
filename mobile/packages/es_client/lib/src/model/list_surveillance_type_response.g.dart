// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_surveillance_type_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListSurveillanceTypeResponse extends ListSurveillanceTypeResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<SurveillanceTypeResponseData> data;

  factory _$ListSurveillanceTypeResponse(
          [void Function(ListSurveillanceTypeResponseBuilder)? updates]) =>
      (ListSurveillanceTypeResponseBuilder()..update(updates))._build();

  _$ListSurveillanceTypeResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListSurveillanceTypeResponse rebuild(
          void Function(ListSurveillanceTypeResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListSurveillanceTypeResponseBuilder toBuilder() =>
      ListSurveillanceTypeResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListSurveillanceTypeResponse &&
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
    return (newBuiltValueToStringHelper(r'ListSurveillanceTypeResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListSurveillanceTypeResponseBuilder
    implements
        Builder<ListSurveillanceTypeResponse,
            ListSurveillanceTypeResponseBuilder> {
  _$ListSurveillanceTypeResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<SurveillanceTypeResponseData>? _data;
  ListBuilder<SurveillanceTypeResponseData> get data =>
      _$this._data ??= ListBuilder<SurveillanceTypeResponseData>();
  set data(ListBuilder<SurveillanceTypeResponseData>? data) =>
      _$this._data = data;

  ListSurveillanceTypeResponseBuilder() {
    ListSurveillanceTypeResponse._defaults(this);
  }

  ListSurveillanceTypeResponseBuilder get _$this {
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
  void replace(ListSurveillanceTypeResponse other) {
    _$v = other as _$ListSurveillanceTypeResponse;
  }

  @override
  void update(void Function(ListSurveillanceTypeResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListSurveillanceTypeResponse build() => _build();

  _$ListSurveillanceTypeResponse _build() {
    _$ListSurveillanceTypeResponse _$result;
    try {
      _$result = _$v ??
          _$ListSurveillanceTypeResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListSurveillanceTypeResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListSurveillanceTypeResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListSurveillanceTypeResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
