// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'submit_visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SubmitVisitDto extends SubmitVisitDto {
  @override
  final UpdateVisitOnSubmitDto visitData;
  @override
  final BuiltList<CreateSampleOnVisitDto> samples;

  factory _$SubmitVisitDto([void Function(SubmitVisitDtoBuilder)? updates]) =>
      (SubmitVisitDtoBuilder()..update(updates))._build();

  _$SubmitVisitDto._({required this.visitData, required this.samples})
      : super._();
  @override
  SubmitVisitDto rebuild(void Function(SubmitVisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SubmitVisitDtoBuilder toBuilder() => SubmitVisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SubmitVisitDto &&
        visitData == other.visitData &&
        samples == other.samples;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, visitData.hashCode);
    _$hash = $jc(_$hash, samples.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SubmitVisitDto')
          ..add('visitData', visitData)
          ..add('samples', samples))
        .toString();
  }
}

class SubmitVisitDtoBuilder
    implements Builder<SubmitVisitDto, SubmitVisitDtoBuilder> {
  _$SubmitVisitDto? _$v;

  UpdateVisitOnSubmitDtoBuilder? _visitData;
  UpdateVisitOnSubmitDtoBuilder get visitData =>
      _$this._visitData ??= UpdateVisitOnSubmitDtoBuilder();
  set visitData(UpdateVisitOnSubmitDtoBuilder? visitData) =>
      _$this._visitData = visitData;

  ListBuilder<CreateSampleOnVisitDto>? _samples;
  ListBuilder<CreateSampleOnVisitDto> get samples =>
      _$this._samples ??= ListBuilder<CreateSampleOnVisitDto>();
  set samples(ListBuilder<CreateSampleOnVisitDto>? samples) =>
      _$this._samples = samples;

  SubmitVisitDtoBuilder() {
    SubmitVisitDto._defaults(this);
  }

  SubmitVisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _visitData = $v.visitData.toBuilder();
      _samples = $v.samples.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SubmitVisitDto other) {
    _$v = other as _$SubmitVisitDto;
  }

  @override
  void update(void Function(SubmitVisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SubmitVisitDto build() => _build();

  _$SubmitVisitDto _build() {
    _$SubmitVisitDto _$result;
    try {
      _$result = _$v ??
          _$SubmitVisitDto._(
            visitData: visitData.build(),
            samples: samples.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'visitData';
        visitData.build();
        _$failedField = 'samples';
        samples.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SubmitVisitDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
