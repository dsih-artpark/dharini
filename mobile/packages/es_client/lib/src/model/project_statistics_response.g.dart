// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_statistics_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectStatisticsResponse extends ProjectStatisticsResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final ProjectStatistics data;

  factory _$ProjectStatisticsResponse(
          [void Function(ProjectStatisticsResponseBuilder)? updates]) =>
      (ProjectStatisticsResponseBuilder()..update(updates))._build();

  _$ProjectStatisticsResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectStatisticsResponse rebuild(
          void Function(ProjectStatisticsResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectStatisticsResponseBuilder toBuilder() =>
      ProjectStatisticsResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectStatisticsResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectStatisticsResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectStatisticsResponseBuilder
    implements
        Builder<ProjectStatisticsResponse, ProjectStatisticsResponseBuilder> {
  _$ProjectStatisticsResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ProjectStatisticsBuilder? _data;
  ProjectStatisticsBuilder get data =>
      _$this._data ??= ProjectStatisticsBuilder();
  set data(ProjectStatisticsBuilder? data) => _$this._data = data;

  ProjectStatisticsResponseBuilder() {
    ProjectStatisticsResponse._defaults(this);
  }

  ProjectStatisticsResponseBuilder get _$this {
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
  void replace(ProjectStatisticsResponse other) {
    _$v = other as _$ProjectStatisticsResponse;
  }

  @override
  void update(void Function(ProjectStatisticsResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectStatisticsResponse build() => _build();

  _$ProjectStatisticsResponse _build() {
    _$ProjectStatisticsResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectStatisticsResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectStatisticsResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectStatisticsResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectStatisticsResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
