// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VisitDto extends VisitDto {
  @override
  final String visitId;
  @override
  final JsonObject visitData;
  @override
  final BuiltList<SampleDto> samples;

  factory _$VisitDto([void Function(VisitDtoBuilder)? updates]) =>
      (VisitDtoBuilder()..update(updates))._build();

  _$VisitDto._(
      {required this.visitId, required this.visitData, required this.samples})
      : super._();
  @override
  VisitDto rebuild(void Function(VisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VisitDtoBuilder toBuilder() => VisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VisitDto &&
        visitId == other.visitId &&
        visitData == other.visitData &&
        samples == other.samples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitId.hashCode);
    _$hash = $jc(_$hash, visitData.hashCode);
    _$hash = $jc(_$hash, samples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VisitDto')
          ..add('visitId', visitId)
          ..add('visitData', visitData)
          ..add('samples', samples))
        .toString();
  }
}

class VisitDtoBuilder implements Builder<VisitDto, VisitDtoBuilder> {
  _$VisitDto? _$v;

  String? _visitId;
  String? get visitId => _$this._visitId;
  set visitId(String? visitId) => _$this._visitId = visitId;

  JsonObject? _visitData;
  JsonObject? get visitData => _$this._visitData;
  set visitData(JsonObject? visitData) => _$this._visitData = visitData;

  ListBuilder<SampleDto>? _samples;
  ListBuilder<SampleDto> get samples =>
      _$this._samples ??= ListBuilder<SampleDto>();
  set samples(ListBuilder<SampleDto>? samples) => _$this._samples = samples;

  VisitDtoBuilder() {
    VisitDto._defaults(this);
  }

  VisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitId = $v.visitId;
      _visitData = $v.visitData;
      _samples = $v.samples.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VisitDto other) {
    _$v = other as _$VisitDto;
  }

  @override
  void update(void Function(VisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VisitDto build() => _build();

  _$VisitDto _build() {
    _$VisitDto _$result;
    try {
      _$result = _$v ??
          _$VisitDto._(
            visitId: BuiltValueNullFieldError.checkNotNull(
                visitId, r'VisitDto', 'visitId'),
            visitData: BuiltValueNullFieldError.checkNotNull(
                visitData, r'VisitDto', 'visitData'),
            samples: samples.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'samples';
        samples.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'VisitDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
