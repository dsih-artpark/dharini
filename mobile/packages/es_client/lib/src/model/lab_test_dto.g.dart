// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lab_test_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LabTestDto extends LabTestDto {
  @override
  final String disease;
  @override
  final String testedAt;
  @override
  final String testResult;
  @override
  final JsonObject testedBy;
  @override
  final LabTestDetailsDto extraDetails;
  @override
  final LabTestDetailsDto details;

  factory _$LabTestDto([void Function(LabTestDtoBuilder)? updates]) =>
      (LabTestDtoBuilder()..update(updates))._build();

  _$LabTestDto._(
      {required this.disease,
      required this.testedAt,
      required this.testResult,
      required this.testedBy,
      required this.extraDetails,
      required this.details})
      : super._();
  @override
  LabTestDto rebuild(void Function(LabTestDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LabTestDtoBuilder toBuilder() => LabTestDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LabTestDto &&
        disease == other.disease &&
        testedAt == other.testedAt &&
        testResult == other.testResult &&
        testedBy == other.testedBy &&
        extraDetails == other.extraDetails &&
        details == other.details;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, testedAt.hashCode);
    _$hash = $jc(_$hash, testResult.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, extraDetails.hashCode);
    _$hash = $jc(_$hash, details.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LabTestDto')
          ..add('disease', disease)
          ..add('testedAt', testedAt)
          ..add('testResult', testResult)
          ..add('testedBy', testedBy)
          ..add('extraDetails', extraDetails)
          ..add('details', details))
        .toString();
  }
}

class LabTestDtoBuilder implements Builder<LabTestDto, LabTestDtoBuilder> {
  _$LabTestDto? _$v;

  String? _disease;
  String? get disease => _$this._disease;
  set disease(String? disease) => _$this._disease = disease;

  String? _testedAt;
  String? get testedAt => _$this._testedAt;
  set testedAt(String? testedAt) => _$this._testedAt = testedAt;

  String? _testResult;
  String? get testResult => _$this._testResult;
  set testResult(String? testResult) => _$this._testResult = testResult;

  JsonObject? _testedBy;
  JsonObject? get testedBy => _$this._testedBy;
  set testedBy(JsonObject? testedBy) => _$this._testedBy = testedBy;

  LabTestDetailsDtoBuilder? _extraDetails;
  LabTestDetailsDtoBuilder get extraDetails =>
      _$this._extraDetails ??= LabTestDetailsDtoBuilder();
  set extraDetails(LabTestDetailsDtoBuilder? extraDetails) =>
      _$this._extraDetails = extraDetails;

  LabTestDetailsDtoBuilder? _details;
  LabTestDetailsDtoBuilder get details =>
      _$this._details ??= LabTestDetailsDtoBuilder();
  set details(LabTestDetailsDtoBuilder? details) => _$this._details = details;

  LabTestDtoBuilder() {
    LabTestDto._defaults(this);
  }

  LabTestDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _disease = $v.disease;
      _testedAt = $v.testedAt;
      _testResult = $v.testResult;
      _testedBy = $v.testedBy;
      _extraDetails = $v.extraDetails.toBuilder();
      _details = $v.details.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LabTestDto other) {
    _$v = other as _$LabTestDto;
  }

  @override
  void update(void Function(LabTestDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LabTestDto build() => _build();

  _$LabTestDto _build() {
    _$LabTestDto _$result;
    try {
      _$result = _$v ??
          _$LabTestDto._(
            disease: BuiltValueNullFieldError.checkNotNull(
                disease, r'LabTestDto', 'disease'),
            testedAt: BuiltValueNullFieldError.checkNotNull(
                testedAt, r'LabTestDto', 'testedAt'),
            testResult: BuiltValueNullFieldError.checkNotNull(
                testResult, r'LabTestDto', 'testResult'),
            testedBy: BuiltValueNullFieldError.checkNotNull(
                testedBy, r'LabTestDto', 'testedBy'),
            extraDetails: extraDetails.build(),
            details: details.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'extraDetails';
        extraDetails.build();
        _$failedField = 'details';
        details.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LabTestDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
