// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lab_test_response_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LabTestResponseDto extends LabTestResponseDto {
  @override
  final TestResultType? testResult;
  @override
  final SampleExposesDto? sample;
  @override
  final UserResponseDto? testedBy;
  @override
  final DiseaseResponseDto? disease;
  @override
  final String id;
  @override
  final DateTime? testedAt;

  factory _$LabTestResponseDto(
          [void Function(LabTestResponseDtoBuilder)? updates]) =>
      (LabTestResponseDtoBuilder()..update(updates))._build();

  _$LabTestResponseDto._(
      {this.testResult,
      this.sample,
      this.testedBy,
      this.disease,
      required this.id,
      this.testedAt})
      : super._();
  @override
  LabTestResponseDto rebuild(
          void Function(LabTestResponseDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LabTestResponseDtoBuilder toBuilder() =>
      LabTestResponseDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LabTestResponseDto &&
        testResult == other.testResult &&
        sample == other.sample &&
        testedBy == other.testedBy &&
        disease == other.disease &&
        id == other.id &&
        testedAt == other.testedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, testResult.hashCode);
    _$hash = $jc(_$hash, sample.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, testedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LabTestResponseDto')
          ..add('testResult', testResult)
          ..add('sample', sample)
          ..add('testedBy', testedBy)
          ..add('disease', disease)
          ..add('id', id)
          ..add('testedAt', testedAt))
        .toString();
  }
}

class LabTestResponseDtoBuilder
    implements Builder<LabTestResponseDto, LabTestResponseDtoBuilder> {
  _$LabTestResponseDto? _$v;

  TestResultType? _testResult;
  TestResultType? get testResult => _$this._testResult;
  set testResult(TestResultType? testResult) => _$this._testResult = testResult;

  SampleExposesDtoBuilder? _sample;
  SampleExposesDtoBuilder get sample =>
      _$this._sample ??= SampleExposesDtoBuilder();
  set sample(SampleExposesDtoBuilder? sample) => _$this._sample = sample;

  UserResponseDtoBuilder? _testedBy;
  UserResponseDtoBuilder get testedBy =>
      _$this._testedBy ??= UserResponseDtoBuilder();
  set testedBy(UserResponseDtoBuilder? testedBy) => _$this._testedBy = testedBy;

  DiseaseResponseDtoBuilder? _disease;
  DiseaseResponseDtoBuilder get disease =>
      _$this._disease ??= DiseaseResponseDtoBuilder();
  set disease(DiseaseResponseDtoBuilder? disease) => _$this._disease = disease;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  DateTime? _testedAt;
  DateTime? get testedAt => _$this._testedAt;
  set testedAt(DateTime? testedAt) => _$this._testedAt = testedAt;

  LabTestResponseDtoBuilder() {
    LabTestResponseDto._defaults(this);
  }

  LabTestResponseDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _testResult = $v.testResult;
      _sample = $v.sample?.toBuilder();
      _testedBy = $v.testedBy?.toBuilder();
      _disease = $v.disease?.toBuilder();
      _id = $v.id;
      _testedAt = $v.testedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LabTestResponseDto other) {
    _$v = other as _$LabTestResponseDto;
  }

  @override
  void update(void Function(LabTestResponseDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LabTestResponseDto build() => _build();

  _$LabTestResponseDto _build() {
    _$LabTestResponseDto _$result;
    try {
      _$result = _$v ??
          _$LabTestResponseDto._(
            testResult: testResult,
            sample: _sample?.build(),
            testedBy: _testedBy?.build(),
            disease: _disease?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'LabTestResponseDto', 'id'),
            testedAt: testedAt,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'sample';
        _sample?.build();
        _$failedField = 'testedBy';
        _testedBy?.build();
        _$failedField = 'disease';
        _disease?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LabTestResponseDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
