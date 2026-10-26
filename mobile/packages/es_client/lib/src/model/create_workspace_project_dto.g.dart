// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_workspace_project_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateWorkspaceProjectDto extends CreateWorkspaceProjectDto {
  @override
  final String name;
  @override
  final String code;
  @override
  final BuiltList<String> diseases;
  @override
  final BuiltList<String> surveillanceTypes;
  @override
  final BuiltList<String> regions;
  @override
  final BuiltList<JsonObject> teams;

  factory _$CreateWorkspaceProjectDto(
          [void Function(CreateWorkspaceProjectDtoBuilder)? updates]) =>
      (CreateWorkspaceProjectDtoBuilder()..update(updates))._build();

  _$CreateWorkspaceProjectDto._(
      {required this.name,
      required this.code,
      required this.diseases,
      required this.surveillanceTypes,
      required this.regions,
      required this.teams})
      : super._();
  @override
  CreateWorkspaceProjectDto rebuild(
          void Function(CreateWorkspaceProjectDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateWorkspaceProjectDtoBuilder toBuilder() =>
      CreateWorkspaceProjectDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateWorkspaceProjectDto &&
        name == other.name &&
        code == other.code &&
        diseases == other.diseases &&
        surveillanceTypes == other.surveillanceTypes &&
        regions == other.regions &&
        teams == other.teams;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, surveillanceTypes.hashCode);
    _$hash = $jc(_$hash, regions.hashCode);
    _$hash = $jc(_$hash, teams.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateWorkspaceProjectDto')
          ..add('name', name)
          ..add('code', code)
          ..add('diseases', diseases)
          ..add('surveillanceTypes', surveillanceTypes)
          ..add('regions', regions)
          ..add('teams', teams))
        .toString();
  }
}

class CreateWorkspaceProjectDtoBuilder
    implements
        Builder<CreateWorkspaceProjectDto, CreateWorkspaceProjectDtoBuilder> {
  _$CreateWorkspaceProjectDto? _$v;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  ListBuilder<String>? _diseases;
  ListBuilder<String> get diseases =>
      _$this._diseases ??= ListBuilder<String>();
  set diseases(ListBuilder<String>? diseases) => _$this._diseases = diseases;

  ListBuilder<String>? _surveillanceTypes;
  ListBuilder<String> get surveillanceTypes =>
      _$this._surveillanceTypes ??= ListBuilder<String>();
  set surveillanceTypes(ListBuilder<String>? surveillanceTypes) =>
      _$this._surveillanceTypes = surveillanceTypes;

  ListBuilder<String>? _regions;
  ListBuilder<String> get regions => _$this._regions ??= ListBuilder<String>();
  set regions(ListBuilder<String>? regions) => _$this._regions = regions;

  ListBuilder<JsonObject>? _teams;
  ListBuilder<JsonObject> get teams =>
      _$this._teams ??= ListBuilder<JsonObject>();
  set teams(ListBuilder<JsonObject>? teams) => _$this._teams = teams;

  CreateWorkspaceProjectDtoBuilder() {
    CreateWorkspaceProjectDto._defaults(this);
  }

  CreateWorkspaceProjectDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _code = $v.code;
      _diseases = $v.diseases.toBuilder();
      _surveillanceTypes = $v.surveillanceTypes.toBuilder();
      _regions = $v.regions.toBuilder();
      _teams = $v.teams.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateWorkspaceProjectDto other) {
    _$v = other as _$CreateWorkspaceProjectDto;
  }

  @override
  void update(void Function(CreateWorkspaceProjectDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateWorkspaceProjectDto build() => _build();

  _$CreateWorkspaceProjectDto _build() {
    _$CreateWorkspaceProjectDto _$result;
    try {
      _$result = _$v ??
          _$CreateWorkspaceProjectDto._(
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'CreateWorkspaceProjectDto', 'name'),
            code: BuiltValueNullFieldError.checkNotNull(
                code, r'CreateWorkspaceProjectDto', 'code'),
            diseases: diseases.build(),
            surveillanceTypes: surveillanceTypes.build(),
            regions: regions.build(),
            teams: teams.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseases';
        diseases.build();
        _$failedField = 'surveillanceTypes';
        surveillanceTypes.build();
        _$failedField = 'regions';
        regions.build();
        _$failedField = 'teams';
        teams.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateWorkspaceProjectDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
