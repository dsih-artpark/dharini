// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistic_by_site_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatisticBySiteResponse extends ProjectStatisticBySiteResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final ProjectStatisticsBySiteResponseData data;

  factory _$ProjectStatisticBySiteResponse(
          [void Function(ProjectStatisticBySiteResponseBuilder)? updates]) =>
      (ProjectStatisticBySiteResponseBuilder()..update(updates))._build();

  _$ProjectStatisticBySiteResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectStatisticBySiteResponse rebuild(
          void Function(ProjectStatisticBySiteResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticBySiteResponseBuilder toBuilder() =>
      ProjectStatisticBySiteResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatisticBySiteResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectStatisticBySiteResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectStatisticBySiteResponseBuilder
    implements
        Builder<ProjectStatisticBySiteResponse,
            ProjectStatisticBySiteResponseBuilder> {
  _$ProjectStatisticBySiteResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ProjectStatisticsBySiteResponseDataBuilder? _data;
  ProjectStatisticsBySiteResponseDataBuilder get data =>
      _$this._data ??= ProjectStatisticsBySiteResponseDataBuilder();
  set data(ProjectStatisticsBySiteResponseDataBuilder? data) =>
      _$this._data = data;

  ProjectStatisticBySiteResponseBuilder() {
    ProjectStatisticBySiteResponse._defaults(this);
  }

  ProjectStatisticBySiteResponseBuilder get _$this {
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
  void replace(ProjectStatisticBySiteResponse other) {
    _$v = other as _$ProjectStatisticBySiteResponse;
  }

  @override
  void update(void Function(ProjectStatisticBySiteResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatisticBySiteResponse build() => _build();

  _$ProjectStatisticBySiteResponse _build() {
    _$ProjectStatisticBySiteResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectStatisticBySiteResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectStatisticBySiteResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectStatisticBySiteResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectStatisticBySiteResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
