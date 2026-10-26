// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_project_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateProjectDto extends UpdateProjectDto {
  @override
  final String? name;
  @override
  final String? code;
  @override
  final BuiltList<String>? diseases;
  @override
  final BuiltList<String>? surveillanceTypes;
  @override
  final BuiltList<String>? regions;
  @override
  final BuiltList<JsonObject>? teams;

  factory _$UpdateProjectDto(
          [void Function(UpdateProjectDtoBuilder)? updates]) =>
      (UpdateProjectDtoBuilder()..update(updates))._build();

  _$UpdateProjectDto._(
      {this.name,
      this.code,
      this.diseases,
      this.surveillanceTypes,
      this.regions,
      this.teams})
      : super._();
  @override
  UpdateProjectDto rebuild(void Function(UpdateProjectDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateProjectDtoBuilder toBuilder() =>
      UpdateProjectDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateProjectDto &&
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
    return (newBuiltValueToStringHelper(r'UpdateProjectDto')
          ..add('name', name)
          ..add('code', code)
          ..add('diseases', diseases)
          ..add('surveillanceTypes', surveillanceTypes)
          ..add('regions', regions)
          ..add('teams', teams))
        .toString();
  }
}

class UpdateProjectDtoBuilder
    implements Builder<UpdateProjectDto, UpdateProjectDtoBuilder> {
  _$UpdateProjectDto? _$v;

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

  UpdateProjectDtoBuilder() {
    UpdateProjectDto._defaults(this);
  }

  UpdateProjectDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _name = $v.name;
      _code = $v.code;
      _diseases = $v.diseases?.toBuilder();
      _surveillanceTypes = $v.surveillanceTypes?.toBuilder();
      _regions = $v.regions?.toBuilder();
      _teams = $v.teams?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateProjectDto other) {
    _$v = other as _$UpdateProjectDto;
  }

  @override
  void update(void Function(UpdateProjectDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateProjectDto build() => _build();

  _$UpdateProjectDto _build() {
    _$UpdateProjectDto _$result;
    try {
      _$result = _$v ??
          _$UpdateProjectDto._(
            name: name,
            code: code,
            diseases: _diseases?.build(),
            surveillanceTypes: _surveillanceTypes?.build(),
            regions: _regions?.build(),
            teams: _teams?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseases';
        _diseases?.build();
        _$failedField = 'surveillanceTypes';
        _surveillanceTypes?.build();
        _$failedField = 'regions';
        _regions?.build();
        _$failedField = 'teams';
        _teams?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateProjectDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
