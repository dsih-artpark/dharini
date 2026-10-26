// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_exposes_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleExposesDto extends SampleExposesDto {
  @override
  final DateTime collectedAt;
  @override
  final DateTime collectionTime;
  @override
  final String? comment;

  factory _$SampleExposesDto(
          [void Function(SampleExposesDtoBuilder)? updates]) =>
      (SampleExposesDtoBuilder()..update(updates))._build();

  _$SampleExposesDto._(
      {required this.collectedAt, required this.collectionTime, this.comment})
      : super._();
  @override
  SampleExposesDto rebuild(void Function(SampleExposesDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleExposesDtoBuilder toBuilder() =>
      SampleExposesDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleExposesDto &&
        collectedAt == other.collectedAt &&
        collectionTime == other.collectionTime &&
        comment == other.comment;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, collectedAt.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleExposesDto')
          ..add('collectedAt', collectedAt)
          ..add('collectionTime', collectionTime)
          ..add('comment', comment))
        .toString();
  }
}

class SampleExposesDtoBuilder
    implements Builder<SampleExposesDto, SampleExposesDtoBuilder> {
  _$SampleExposesDto? _$v;

  DateTime? _collectedAt;
  DateTime? get collectedAt => _$this._collectedAt;
  set collectedAt(DateTime? collectedAt) => _$this._collectedAt = collectedAt;

  DateTime? _collectionTime;
  DateTime? get collectionTime => _$this._collectionTime;
  set collectionTime(DateTime? collectionTime) =>
      _$this._collectionTime = collectionTime;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  SampleExposesDtoBuilder() {
    SampleExposesDto._defaults(this);
  }

  SampleExposesDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _collectedAt = $v.collectedAt;
      _collectionTime = $v.collectionTime;
      _comment = $v.comment;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleExposesDto other) {
    _$v = other as _$SampleExposesDto;
  }

  @override
  void update(void Function(SampleExposesDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleExposesDto build() => _build();

  _$SampleExposesDto _build() {
    final _$result = _$v ??
        _$SampleExposesDto._(
          collectedAt: BuiltValueNullFieldError.checkNotNull(
              collectedAt, r'SampleExposesDto', 'collectedAt'),
          collectionTime: BuiltValueNullFieldError.checkNotNull(
              collectionTime, r'SampleExposesDto', 'collectionTime'),
          comment: comment,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
