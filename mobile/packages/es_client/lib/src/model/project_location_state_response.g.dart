// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_location_state_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectLocationStateResponse extends ProjectLocationStateResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<ProjectLocationStateType> data;

  factory _$ProjectLocationStateResponse(
          [void Function(ProjectLocationStateResponseBuilder)? updates]) =>
      (ProjectLocationStateResponseBuilder()..update(updates))._build();

  _$ProjectLocationStateResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ProjectLocationStateResponse rebuild(
          void Function(ProjectLocationStateResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectLocationStateResponseBuilder toBuilder() =>
      ProjectLocationStateResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectLocationStateResponse &&
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
    return (newBuiltValueToStringHelper(r'ProjectLocationStateResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ProjectLocationStateResponseBuilder
    implements
        Builder<ProjectLocationStateResponse,
            ProjectLocationStateResponseBuilder> {
  _$ProjectLocationStateResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<ProjectLocationStateType>? _data;
  ListBuilder<ProjectLocationStateType> get data =>
      _$this._data ??= ListBuilder<ProjectLocationStateType>();
  set data(ListBuilder<ProjectLocationStateType>? data) => _$this._data = data;

  ProjectLocationStateResponseBuilder() {
    ProjectLocationStateResponse._defaults(this);
  }

  ProjectLocationStateResponseBuilder get _$this {
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
  void replace(ProjectLocationStateResponse other) {
    _$v = other as _$ProjectLocationStateResponse;
  }

  @override
  void update(void Function(ProjectLocationStateResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectLocationStateResponse build() => _build();

  _$ProjectLocationStateResponse _build() {
    _$ProjectLocationStateResponse _$result;
    try {
      _$result = _$v ??
          _$ProjectLocationStateResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ProjectLocationStateResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ProjectLocationStateResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectLocationStateResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
