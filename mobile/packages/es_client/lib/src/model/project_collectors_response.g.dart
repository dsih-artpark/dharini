// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_collectors_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectCollectorsResponse extends ProjectCollectorsResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<User> data;

  factory _$ProjectCollectorsResponse(
          [void Function(ProjectCollectorsResponseBuilder)? updates]) =>
      (ProjectCollectorsResponseBuilder()..update(updates))._build();

  _$ProjectCollectorsResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectCollectorsResponse rebuild(
          void Function(ProjectCollectorsResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectCollectorsResponseBuilder toBuilder() =>
      ProjectCollectorsResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectCollectorsResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectCollectorsResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectCollectorsResponseBuilder
    implements
        Builder<ProjectCollectorsResponse, ProjectCollectorsResponseBuilder> {
  _$ProjectCollectorsResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<User>? _data;
  ListBuilder<User> get data => _$this._data ??= ListBuilder<User>();
  set data(ListBuilder<User>? data) => _$this._data = data;

  ProjectCollectorsResponseBuilder() {
    ProjectCollectorsResponse._defaults(this);
  }

  ProjectCollectorsResponseBuilder get _$this {
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
  void replace(ProjectCollectorsResponse other) {
    _$v = other as _$ProjectCollectorsResponse;
  }

  @override
  void update(void Function(ProjectCollectorsResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectCollectorsResponse build() => _build();

  _$ProjectCollectorsResponse _build() {
    _$ProjectCollectorsResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectCollectorsResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectCollectorsResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectCollectorsResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectCollectorsResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
