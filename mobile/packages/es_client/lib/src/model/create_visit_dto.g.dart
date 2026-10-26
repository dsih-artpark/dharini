// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreateVisitDto extends CreateVisitDto {
  @override
  final String siteId;
  @override
  final String collectorId;
  @override
  final String visitScheduledAt;
  @override
  final String? visitedAt;
  @override
  final String? comment;

  factory _$CreateVisitDto([void Function(CreateVisitDtoBuilder)? updates]) =>
      (CreateVisitDtoBuilder()..update(updates))._build();

  _$CreateVisitDto._(
      {required this.siteId,
      required this.collectorId,
      required this.visitScheduledAt,
      this.visitedAt,
      this.comment})
      : super._();
  @override
  CreateVisitDto rebuild(void Function(CreateVisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateVisitDtoBuilder toBuilder() => CreateVisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateVisitDto &&
        siteId == other.siteId &&
        collectorId == other.collectorId &&
        visitScheduledAt == other.visitScheduledAt &&
        visitedAt == other.visitedAt &&
        comment == other.comment;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, siteId.hashCode);
    _$hash = $jc(_$hash, collectorId.hashCode);
    _$hash = $jc(_$hash, visitScheduledAt.hashCode);
    _$hash = $jc(_$hash, visitedAt.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateVisitDto')
          ..add('siteId', siteId)
          ..add('collectorId', collectorId)
          ..add('visitScheduledAt', visitScheduledAt)
          ..add('visitedAt', visitedAt)
          ..add('comment', comment))
        .toString();
  }
}

class CreateVisitDtoBuilder
    implements Builder<CreateVisitDto, CreateVisitDtoBuilder> {
  _$CreateVisitDto? _$v;

  String? _siteId;
  String? get siteId => _$this._siteId;
  set siteId(String? siteId) => _$this._siteId = siteId;

  String? _collectorId;
  String? get collectorId => _$this._collectorId;
  set collectorId(String? collectorId) => _$this._collectorId = collectorId;

  String? _visitScheduledAt;
  String? get visitScheduledAt => _$this._visitScheduledAt;
  set visitScheduledAt(String? visitScheduledAt) =>
      _$this._visitScheduledAt = visitScheduledAt;

  String? _visitedAt;
  String? get visitedAt => _$this._visitedAt;
  set visitedAt(String? visitedAt) => _$this._visitedAt = visitedAt;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  CreateVisitDtoBuilder() {
    CreateVisitDto._defaults(this);
  }

  CreateVisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _siteId = $v.siteId;
      _collectorId = $v.collectorId;
      _visitScheduledAt = $v.visitScheduledAt;
      _visitedAt = $v.visitedAt;
      _comment = $v.comment;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateVisitDto other) {
    _$v = other as _$CreateVisitDto;
  }

  @override
  void update(void Function(CreateVisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateVisitDto build() => _build();

  _$CreateVisitDto _build() {
    final _$result = _$v ??
        _$CreateVisitDto._(
          siteId: BuiltValueNullFieldError.checkNotNull(
              siteId, r'CreateVisitDto', 'siteId'),
          collectorId: BuiltValueNullFieldError.checkNotNull(
              collectorId, r'CreateVisitDto', 'collectorId'),
          visitScheduledAt: BuiltValueNullFieldError.checkNotNull(
              visitScheduledAt, r'CreateVisitDto', 'visitScheduledAt'),
          visitedAt: visitedAt,
          comment: comment,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
