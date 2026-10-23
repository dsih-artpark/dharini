// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lab_test_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LabTestResponseData extends LabTestResponseData {
  @override
  final TestResultType? testResult;
  @override
  final Project? project;
  @override
  final Sample? sample;
  @override
  final Disease? disease;
  @override
  final User? testedBy;
  @override
  final String id;
  @override
  final String? ctValue;
  @override
  final String? variant;
  @override
  final String? viralLoad;
  @override
  final String? kitOrProtocol;
  @override
  final String? labComment;
  @override
  final DateTime? resultDate;
  @override
  final String? resultComment;
  @override
  final String? testResultReport;
  @override
  final DateTime? testedAt;

  factory _$LabTestResponseData(
          [void Function(LabTestResponseDataBuilder)? updates]) =>
      (LabTestResponseDataBuilder()..update(updates))._build();

  _$LabTestResponseData._(
      {this.testResult,
      this.project,
      this.sample,
      this.disease,
      this.testedBy,
      required this.id,
      this.ctValue,
      this.variant,
      this.viralLoad,
      this.kitOrProtocol,
      this.labComment,
      this.resultDate,
      this.resultComment,
      this.testResultReport,
      this.testedAt})
      : super._();
  @override
  LabTestResponseData rebuild(
          void Function(LabTestResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LabTestResponseDataBuilder toBuilder() =>
      LabTestResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LabTestResponseData &&
        testResult == other.testResult &&
        project == other.project &&
        sample == other.sample &&
        disease == other.disease &&
        testedBy == other.testedBy &&
        id == other.id &&
        ctValue == other.ctValue &&
        variant == other.variant &&
        viralLoad == other.viralLoad &&
        kitOrProtocol == other.kitOrProtocol &&
        labComment == other.labComment &&
        resultDate == other.resultDate &&
        resultComment == other.resultComment &&
        testResultReport == other.testResultReport &&
        testedAt == other.testedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, testResult.hashCode);
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, sample.hashCode);
    _$hash = $jc(_$hash, disease.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, ctValue.hashCode);
    _$hash = $jc(_$hash, variant.hashCode);
    _$hash = $jc(_$hash, viralLoad.hashCode);
    _$hash = $jc(_$hash, kitOrProtocol.hashCode);
    _$hash = $jc(_$hash, labComment.hashCode);
    _$hash = $jc(_$hash, resultDate.hashCode);
    _$hash = $jc(_$hash, resultComment.hashCode);
    _$hash = $jc(_$hash, testResultReport.hashCode);
    _$hash = $jc(_$hash, testedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LabTestResponseData')
          ..add('testResult', testResult)
          ..add('project', project)
          ..add('sample', sample)
          ..add('disease', disease)
          ..add('testedBy', testedBy)
          ..add('id', id)
          ..add('ctValue', ctValue)
          ..add('variant', variant)
          ..add('viralLoad', viralLoad)
          ..add('kitOrProtocol', kitOrProtocol)
          ..add('labComment', labComment)
          ..add('resultDate', resultDate)
          ..add('resultComment', resultComment)
          ..add('testResultReport', testResultReport)
          ..add('testedAt', testedAt))
        .toString();
  }
}

class LabTestResponseDataBuilder
    implements Builder<LabTestResponseData, LabTestResponseDataBuilder> {
  _$LabTestResponseData? _$v;

  TestResultType? _testResult;
  TestResultType? get testResult => _$this._testResult;
  set testResult(TestResultType? testResult) => _$this._testResult = testResult;

  ProjectBuilder? _project;
  ProjectBuilder get project => _$this._project ??= ProjectBuilder();
  set project(ProjectBuilder? project) => _$this._project = project;

  SampleBuilder? _sample;
  SampleBuilder get sample => _$this._sample ??= SampleBuilder();
  set sample(SampleBuilder? sample) => _$this._sample = sample;

  DiseaseBuilder? _disease;
  DiseaseBuilder get disease => _$this._disease ??= DiseaseBuilder();
  set disease(DiseaseBuilder? disease) => _$this._disease = disease;

  UserBuilder? _testedBy;
  UserBuilder get testedBy => _$this._testedBy ??= UserBuilder();
  set testedBy(UserBuilder? testedBy) => _$this._testedBy = testedBy;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _ctValue;
  String? get ctValue => _$this._ctValue;
  set ctValue(String? ctValue) => _$this._ctValue = ctValue;

  String? _variant;
  String? get variant => _$this._variant;
  set variant(String? variant) => _$this._variant = variant;

  String? _viralLoad;
  String? get viralLoad => _$this._viralLoad;
  set viralLoad(String? viralLoad) => _$this._viralLoad = viralLoad;

  String? _kitOrProtocol;
  String? get kitOrProtocol => _$this._kitOrProtocol;
  set kitOrProtocol(String? kitOrProtocol) =>
      _$this._kitOrProtocol = kitOrProtocol;

  String? _labComment;
  String? get labComment => _$this._labComment;
  set labComment(String? labComment) => _$this._labComment = labComment;

  DateTime? _resultDate;
  DateTime? get resultDate => _$this._resultDate;
  set resultDate(DateTime? resultDate) => _$this._resultDate = resultDate;

  String? _resultComment;
  String? get resultComment => _$this._resultComment;
  set resultComment(String? resultComment) =>
      _$this._resultComment = resultComment;

  String? _testResultReport;
  String? get testResultReport => _$this._testResultReport;
  set testResultReport(String? testResultReport) =>
      _$this._testResultReport = testResultReport;

  DateTime? _testedAt;
  DateTime? get testedAt => _$this._testedAt;
  set testedAt(DateTime? testedAt) => _$this._testedAt = testedAt;

  LabTestResponseDataBuilder() {
    LabTestResponseData._defaults(this);
  }

  LabTestResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _testResult = $v.testResult;
      _project = $v.project?.toBuilder();
      _sample = $v.sample?.toBuilder();
      _disease = $v.disease?.toBuilder();
      _testedBy = $v.testedBy?.toBuilder();
      _id = $v.id;
      _ctValue = $v.ctValue;
      _variant = $v.variant;
      _viralLoad = $v.viralLoad;
      _kitOrProtocol = $v.kitOrProtocol;
      _labComment = $v.labComment;
      _resultDate = $v.resultDate;
      _resultComment = $v.resultComment;
      _testResultReport = $v.testResultReport;
      _testedAt = $v.testedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LabTestResponseData other) {
    _$v = other as _$LabTestResponseData;
  }

  @override
  void update(void Function(LabTestResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LabTestResponseData build() => _build();

  _$LabTestResponseData _build() {
    _$LabTestResponseData _$result;
    try {
      _$result = _$v ??
          _$LabTestResponseData._(
            testResult: testResult,
            project: _project?.build(),
            sample: _sample?.build(),
            disease: _disease?.build(),
            testedBy: _testedBy?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'LabTestResponseData', 'id'),
            ctValue: ctValue,
            variant: variant,
            viralLoad: viralLoad,
            kitOrProtocol: kitOrProtocol,
            labComment: labComment,
            resultDate: resultDate,
            resultComment: resultComment,
            testResultReport: testResultReport,
            testedAt: testedAt,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'project';
        _project?.build();
        _$failedField = 'sample';
        _sample?.build();
        _$failedField = 'disease';
        _disease?.build();
        _$failedField = 'testedBy';
        _testedBy?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LabTestResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
