// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invite_partner_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InvitePartnerDto extends InvitePartnerDto {
  @override
  final BuiltList<String>? individualContractors;
  @override
  final BuiltList<String>? collectors;
  @override
  final JsonObject? projectId;
  @override
  final JsonObject? invitedBy;

  factory _$InvitePartnerDto(
          [void Function(InvitePartnerDtoBuilder)? updates]) =>
      (InvitePartnerDtoBuilder()..update(updates))._build();

  _$InvitePartnerDto._(
      {this.individualContractors,
      this.collectors,
      this.projectId,
      this.invitedBy})
      : super._();
  @override
  InvitePartnerDto rebuild(void Function(InvitePartnerDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InvitePartnerDtoBuilder toBuilder() =>
      InvitePartnerDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InvitePartnerDto &&
        individualContractors == other.individualContractors &&
        collectors == other.collectors &&
        projectId == other.projectId &&
        invitedBy == other.invitedBy;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, individualContractors.hashCode);
    _$hash = $jc(_$hash, collectors.hashCode);
    _$hash = $jc(_$hash, projectId.hashCode);
    _$hash = $jc(_$hash, invitedBy.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'InvitePartnerDto')
          ..add('individualContractors', individualContractors)
          ..add('collectors', collectors)
          ..add('projectId', projectId)
          ..add('invitedBy', invitedBy))
        .toString();
  }
}

class InvitePartnerDtoBuilder
    implements Builder<InvitePartnerDto, InvitePartnerDtoBuilder> {
  _$InvitePartnerDto? _$v;

  ListBuilder<String>? _individualContractors;
  ListBuilder<String> get individualContractors =>
      _$this._individualContractors ??= ListBuilder<String>();
  set individualContractors(ListBuilder<String>? individualContractors) =>
      _$this._individualContractors = individualContractors;

  ListBuilder<String>? _collectors;
  ListBuilder<String> get collectors =>
      _$this._collectors ??= ListBuilder<String>();
  set collectors(ListBuilder<String>? collectors) =>
      _$this._collectors = collectors;

  JsonObject? _projectId;
  JsonObject? get projectId => _$this._projectId;
  set projectId(JsonObject? projectId) => _$this._projectId = projectId;

  JsonObject? _invitedBy;
  JsonObject? get invitedBy => _$this._invitedBy;
  set invitedBy(JsonObject? invitedBy) => _$this._invitedBy = invitedBy;

  InvitePartnerDtoBuilder() {
    InvitePartnerDto._defaults(this);
  }

  InvitePartnerDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _individualContractors = $v.individualContractors?.toBuilder();
      _collectors = $v.collectors?.toBuilder();
      _projectId = $v.projectId;
      _invitedBy = $v.invitedBy;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(InvitePartnerDto other) {
    _$v = other as _$InvitePartnerDto;
  }

  @override
  void update(void Function(InvitePartnerDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InvitePartnerDto build() => _build();

  _$InvitePartnerDto _build() {
    _$InvitePartnerDto _$result;
    try {
      _$result = _$v ??
          _$InvitePartnerDto._(
            individualContractors: _individualContractors?.build(),
            collectors: _collectors?.build(),
            projectId: projectId,
            invitedBy: invitedBy,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'individualContractors';
        _individualContractors?.build();
        _$failedField = 'collectors';
        _collectors?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'InvitePartnerDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
