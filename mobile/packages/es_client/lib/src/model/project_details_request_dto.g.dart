// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_details_request_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ProjectDetailsRequestDto extends ProjectDetailsRequestDto {
  @override
  final BuiltList<String> projectId;

  factory _$ProjectDetailsRequestDto(
          [void Function(ProjectDetailsRequestDtoBuilder)? updates]) =>
      (ProjectDetailsRequestDtoBuilder()..update(updates))._build();

  _$ProjectDetailsRequestDto._({required this.projectId}) : super._();
  @override
  ProjectDetailsRequestDto rebuild(
          void Function(ProjectDetailsRequestDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ProjectDetailsRequestDtoBuilder toBuilder() =>
      ProjectDetailsRequestDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ProjectDetailsRequestDto && projectId == other.projectId;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, projectId.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ProjectDetailsRequestDto')
          ..add('projectId', projectId))
        .toString();
  }
}

class ProjectDetailsRequestDtoBuilder
    implements
        Builder<ProjectDetailsRequestDto, ProjectDetailsRequestDtoBuilder> {
  _$ProjectDetailsRequestDto? _$v;

  ListBuilder<String>? _projectId;
  ListBuilder<String> get projectId =>
      _$this._projectId ??= ListBuilder<String>();
  set projectId(ListBuilder<String>? projectId) =>
      _$this._projectId = projectId;

  ProjectDetailsRequestDtoBuilder() {
    ProjectDetailsRequestDto._defaults(this);
  }

  ProjectDetailsRequestDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _projectId = $v.projectId.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ProjectDetailsRequestDto other) {
    _$v = other as _$ProjectDetailsRequestDto;
  }

  @override
  void update(void Function(ProjectDetailsRequestDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ProjectDetailsRequestDto build() => _build();

  _$ProjectDetailsRequestDto _build() {
    _$ProjectDetailsRequestDto _$result;
    try {
      _$result = _$v ??
          _$ProjectDetailsRequestDto._(
            projectId: projectId.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'projectId';
        projectId.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ProjectDetailsRequestDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
