// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectResponse extends ProjectResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final ProjectResponseData data;

  factory _$ProjectResponse([void Function(ProjectResponseBuilder)? updates]) =>
      (ProjectResponseBuilder()..update(updates))._build();

  _$ProjectResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectResponse rebuild(void Function(ProjectResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectResponseBuilder toBuilder() => ProjectResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectResponseBuilder
    implements Builder<ProjectResponse, ProjectResponseBuilder> {
  _$ProjectResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ProjectResponseDataBuilder? _data;
  ProjectResponseDataBuilder get data =>
      _$this._data ??= ProjectResponseDataBuilder();
  set data(ProjectResponseDataBuilder? data) => _$this._data = data;

  ProjectResponseBuilder() {
    ProjectResponse._defaults(this);
  }

  ProjectResponseBuilder get _$this {
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
  void replace(ProjectResponse other) {
    _$v = other as _$ProjectResponse;
  }

  @override
  void update(void Function(ProjectResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectResponse build() => _build();

  _$ProjectResponse _build() {
    _$ProjectResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
