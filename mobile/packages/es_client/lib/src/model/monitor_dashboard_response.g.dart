// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'monitor_dashboard_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MonitorDashboardResponse extends MonitorDashboardResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final MonitorDashboardResponseData data;

  factory _$MonitorDashboardResponse(
          [void Function(MonitorDashboardResponseBuilder)? updates]) =>
      (MonitorDashboardResponseBuilder()..update(updates))._build();

  _$MonitorDashboardResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  MonitorDashboardResponse rebuild(
          void Function(MonitorDashboardResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MonitorDashboardResponseBuilder toBuilder() =>
      MonitorDashboardResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MonitorDashboardResponse &&
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
    return (newBuiltValueToStringHelper(r'MonitorDashboardResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class MonitorDashboardResponseBuilder
    implements
        Builder<MonitorDashboardResponse, MonitorDashboardResponseBuilder> {
  _$MonitorDashboardResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  MonitorDashboardResponseDataBuilder? _data;
  MonitorDashboardResponseDataBuilder get data =>
      _$this._data ??= MonitorDashboardResponseDataBuilder();
  set data(MonitorDashboardResponseDataBuilder? data) => _$this._data = data;

  MonitorDashboardResponseBuilder() {
    MonitorDashboardResponse._defaults(this);
  }

  MonitorDashboardResponseBuilder get _$this {
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
  void replace(MonitorDashboardResponse other) {
    _$v = other as _$MonitorDashboardResponse;
  }

  @override
  void update(void Function(MonitorDashboardResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MonitorDashboardResponse build() => _build();

  _$MonitorDashboardResponse _build() {
    _$MonitorDashboardResponse _$result;
    try {
      _$result = _$v ??
          _$MonitorDashboardResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'MonitorDashboardResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'MonitorDashboardResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MonitorDashboardResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
