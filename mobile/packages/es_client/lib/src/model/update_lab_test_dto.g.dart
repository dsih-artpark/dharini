// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_lab_test_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateLabTestDto extends UpdateLabTestDto {
  @override
  final JsonObject? sample;
  @override
  final JsonObject? disease;
  @override
  final String? kitOrProtocol;
  @override
  final DateTime? testedAt;
  @override
  final String? labComment;
  @override
  final JsonObject? testedBy;
  @override
  final JsonObject? details;
  @override
  final TestResultType? testResult;
  @override
  final String? ctValue;
  @override
  final String? variant;
  @override
  final String? viralLoad;
  @override
  final String? testResultReport;
  @override
  final String id;
  @override
  final DateTime? resultDate;
  @override
  final String? resultComment;

  factory _$UpdateLabTestDto(
          [void Function(UpdateLabTestDtoBuilder)? updates]) =>
      (UpdateLabTestDtoBuilder()..update(updates))._build();

  _$UpdateLabTestDto._(
      {this.sample,
      this.disease,
      this.kitOrProtocol,
      this.testedAt,
      this.labComment,
      this.testedBy,
      this.details,
      this.testResult,
      this.ctValue,
      this.variant,
      this.viralLoad,
      this.testResultReport,
      required this.id,
      this.resultDate,
      this.resultComment})
      : super._();
  @override
  UpdateLabTestDto rebuild(void Function(UpdateLabTestDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateLabTestDtoBuilder toBuilder() =>
      UpdateLabTestDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateLabTestDto &&
        sample == other.sample &&
        disease == other.disease &&
        kitOrProtocol == other.kitOrProtocol &&
        testedAt == other.testedAt &&
        labComment == other.labComment &&
        testedBy == other.testedBy &&
        details == other.details &&
        testResult == other.testResult &&
        ctValue == other.ctValue &&
        variant == other.variant &&
        viralLoad == other.viralLoad &&
        testResultReport == other.testResultReport &&
        id == other.id &&
        resultDate == other.resultDate &&
        resultComment == other.resultComment;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, sample.hashCode);
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, kitOrProtocol.hashCode);
    _$hash = $jc(_$hash, testedAt.hashCode);
    _$hash = $jc(_$hash, labComment.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, details.hashCode);
    _$hash = $jc(_$hash, testResult.hashCode);
    _$hash = $jc(_$hash, ctValue.hashCode);
    _$hash = $jc(_$hash, variant.hashCode);
    _$hash = $jc(_$hash, viralLoad.hashCode);
    _$hash = $jc(_$hash, testResultReport.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, resultDate.hashCode);
    _$hash = $jc(_$hash, resultComment.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateLabTestDto')
          ..add('sample', sample)
          ..add('disease', disease)
          ..add('kitOrProtocol', kitOrProtocol)
          ..add('testedAt', testedAt)
          ..add('labComment', labComment)
          ..add('testedBy', testedBy)
          ..add('details', details)
          ..add('testResult', testResult)
          ..add('ctValue', ctValue)
          ..add('variant', variant)
          ..add('viralLoad', viralLoad)
          ..add('testResultReport', testResultReport)
          ..add('id', id)
          ..add('resultDate', resultDate)
          ..add('resultComment', resultComment))
        .toString();
  }
}

class UpdateLabTestDtoBuilder
    implements Builder<UpdateLabTestDto, UpdateLabTestDtoBuilder> {
  _$UpdateLabTestDto? _$v;

  JsonObject? _sample;
  JsonObject? get sample => _$this._sample;
  set sample(JsonObject? sample) => _$this._sample = sample;

  JsonObject? _disease;
  JsonObject? get disease => _$this._disease;
  set disease(JsonObject? disease) => _$this._disease = disease;

  String? _kitOrProtocol;
  String? get kitOrProtocol => _$this._kitOrProtocol;
  set kitOrProtocol(String? kitOrProtocol) =>
      _$this._kitOrProtocol = kitOrProtocol;

  DateTime? _testedAt;
  DateTime? get testedAt => _$this._testedAt;
  set testedAt(DateTime? testedAt) => _$this._testedAt = testedAt;

  String? _labComment;
  String? get labComment => _$this._labComment;
  set labComment(String? labComment) => _$this._labComment = labComment;

  JsonObject? _testedBy;
  JsonObject? get testedBy => _$this._testedBy;
  set testedBy(JsonObject? testedBy) => _$this._testedBy = testedBy;

  JsonObject? _details;
  JsonObject? get details => _$this._details;
  set details(JsonObject? details) => _$this._details = details;

  TestResultType? _testResult;
  TestResultType? get testResult => _$this._testResult;
  set testResult(TestResultType? testResult) => _$this._testResult = testResult;

  String? _ctValue;
  String? get ctValue => _$this._ctValue;
  set ctValue(String? ctValue) => _$this._ctValue = ctValue;

  String? _variant;
  String? get variant => _$this._variant;
  set variant(String? variant) => _$this._variant = variant;

  String? _viralLoad;
  String? get viralLoad => _$this._viralLoad;
  set viralLoad(String? viralLoad) => _$this._viralLoad = viralLoad;

  String? _testResultReport;
  String? get testResultReport => _$this._testResultReport;
  set testResultReport(String? testResultReport) =>
      _$this._testResultReport = testResultReport;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  DateTime? _resultDate;
  DateTime? get resultDate => _$this._resultDate;
  set resultDate(DateTime? resultDate) => _$this._resultDate = resultDate;

  String? _resultComment;
  String? get resultComment => _$this._resultComment;
  set resultComment(String? resultComment) =>
      _$this._resultComment = resultComment;

  UpdateLabTestDtoBuilder() {
    UpdateLabTestDto._defaults(this);
  }

  UpdateLabTestDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _sample = $v.sample;
      _disease = $v.disease;
      _kitOrProtocol = $v.kitOrProtocol;
      _testedAt = $v.testedAt;
      _labComment = $v.labComment;
      _testedBy = $v.testedBy;
      _details = $v.details;
      _testResult = $v.testResult;
      _ctValue = $v.ctValue;
      _variant = $v.variant;
      _viralLoad = $v.viralLoad;
      _testResultReport = $v.testResultReport;
      _id = $v.id;
      _resultDate = $v.resultDate;
      _resultComment = $v.resultComment;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateLabTestDto other) {
    _$v = other as _$UpdateLabTestDto;
  }

  @override
  void update(void Function(UpdateLabTestDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateLabTestDto build() => _build();

  _$UpdateLabTestDto _build() {
    final _$result = _$v ??
        _$UpdateLabTestDto._(
          sample: sample,
          disease: disease,
          kitOrProtocol: kitOrProtocol,
          testedAt: testedAt,
          labComment: labComment,
          testedBy: testedBy,
          details: details,
          testResult: testResult,
          ctValue: ctValue,
          variant: variant,
          viralLoad: viralLoad,
          testResultReport: testResultReport,
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'UpdateLabTestDto', 'id'),
          resultDate: resultDate,
          resultComment: resultComment,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
