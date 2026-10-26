// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'submit_sequencing_job_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const SubmitSequencingJobDtoSourceTypeEnum
    _$submitSequencingJobDtoSourceTypeEnum_lab =
    const SubmitSequencingJobDtoSourceTypeEnum._('lab');
const SubmitSequencingJobDtoSourceTypeEnum
    _$submitSequencingJobDtoSourceTypeEnum_ncbi =
    const SubmitSequencingJobDtoSourceTypeEnum._('ncbi');
const SubmitSequencingJobDtoSourceTypeEnum
    _$submitSequencingJobDtoSourceTypeEnum_manual =
    const SubmitSequencingJobDtoSourceTypeEnum._('manual');
const SubmitSequencingJobDtoSourceTypeEnum
    _$submitSequencingJobDtoSourceTypeEnum_unknownDefaultOpenApi =
    const SubmitSequencingJobDtoSourceTypeEnum._('unknownDefaultOpenApi');

SubmitSequencingJobDtoSourceTypeEnum
    _$submitSequencingJobDtoSourceTypeEnumValueOf(String name) {
  switch (name) {
    case 'lab':
      return _$submitSequencingJobDtoSourceTypeEnum_lab;
    case 'ncbi':
      return _$submitSequencingJobDtoSourceTypeEnum_ncbi;
    case 'manual':
      return _$submitSequencingJobDtoSourceTypeEnum_manual;
    case 'unknownDefaultOpenApi':
      return _$submitSequencingJobDtoSourceTypeEnum_unknownDefaultOpenApi;
    default:
      return _$submitSequencingJobDtoSourceTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SubmitSequencingJobDtoSourceTypeEnum>
    _$submitSequencingJobDtoSourceTypeEnumValues = BuiltSet<
        SubmitSequencingJobDtoSourceTypeEnum>(const <SubmitSequencingJobDtoSourceTypeEnum>[
  _$submitSequencingJobDtoSourceTypeEnum_lab,
  _$submitSequencingJobDtoSourceTypeEnum_ncbi,
  _$submitSequencingJobDtoSourceTypeEnum_manual,
  _$submitSequencingJobDtoSourceTypeEnum_unknownDefaultOpenApi,
]);

const SubmitSequencingJobDtoFileFormatEnum
    _$submitSequencingJobDtoFileFormatEnum_FASTA =
    const SubmitSequencingJobDtoFileFormatEnum._('FASTA');
const SubmitSequencingJobDtoFileFormatEnum
    _$submitSequencingJobDtoFileFormatEnum_FASTQ =
    const SubmitSequencingJobDtoFileFormatEnum._('FASTQ');
const SubmitSequencingJobDtoFileFormatEnum
    _$submitSequencingJobDtoFileFormatEnum_unknownDefaultOpenApi =
    const SubmitSequencingJobDtoFileFormatEnum._('unknownDefaultOpenApi');

SubmitSequencingJobDtoFileFormatEnum
    _$submitSequencingJobDtoFileFormatEnumValueOf(String name) {
  switch (name) {
    case 'FASTA':
      return _$submitSequencingJobDtoFileFormatEnum_FASTA;
    case 'FASTQ':
      return _$submitSequencingJobDtoFileFormatEnum_FASTQ;
    case 'unknownDefaultOpenApi':
      return _$submitSequencingJobDtoFileFormatEnum_unknownDefaultOpenApi;
    default:
      return _$submitSequencingJobDtoFileFormatEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SubmitSequencingJobDtoFileFormatEnum>
    _$submitSequencingJobDtoFileFormatEnumValues = BuiltSet<
        SubmitSequencingJobDtoFileFormatEnum>(const <SubmitSequencingJobDtoFileFormatEnum>[
  _$submitSequencingJobDtoFileFormatEnum_FASTA,
  _$submitSequencingJobDtoFileFormatEnum_FASTQ,
  _$submitSequencingJobDtoFileFormatEnum_unknownDefaultOpenApi,
]);

const SubmitSequencingJobDtoLibraryTypeEnum
    _$submitSequencingJobDtoLibraryTypeEnum_singleEnd =
    const SubmitSequencingJobDtoLibraryTypeEnum._('singleEnd');
const SubmitSequencingJobDtoLibraryTypeEnum
    _$submitSequencingJobDtoLibraryTypeEnum_pairedEnd =
    const SubmitSequencingJobDtoLibraryTypeEnum._('pairedEnd');
const SubmitSequencingJobDtoLibraryTypeEnum
    _$submitSequencingJobDtoLibraryTypeEnum_unknownDefaultOpenApi =
    const SubmitSequencingJobDtoLibraryTypeEnum._('unknownDefaultOpenApi');

SubmitSequencingJobDtoLibraryTypeEnum
    _$submitSequencingJobDtoLibraryTypeEnumValueOf(String name) {
  switch (name) {
    case 'singleEnd':
      return _$submitSequencingJobDtoLibraryTypeEnum_singleEnd;
    case 'pairedEnd':
      return _$submitSequencingJobDtoLibraryTypeEnum_pairedEnd;
    case 'unknownDefaultOpenApi':
      return _$submitSequencingJobDtoLibraryTypeEnum_unknownDefaultOpenApi;
    default:
      return _$submitSequencingJobDtoLibraryTypeEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<SubmitSequencingJobDtoLibraryTypeEnum>
    _$submitSequencingJobDtoLibraryTypeEnumValues = BuiltSet<
        SubmitSequencingJobDtoLibraryTypeEnum>(const <SubmitSequencingJobDtoLibraryTypeEnum>[
  _$submitSequencingJobDtoLibraryTypeEnum_singleEnd,
  _$submitSequencingJobDtoLibraryTypeEnum_pairedEnd,
  _$submitSequencingJobDtoLibraryTypeEnum_unknownDefaultOpenApi,
]);

Serializer<SubmitSequencingJobDtoSourceTypeEnum>
    _$submitSequencingJobDtoSourceTypeEnumSerializer =
    _$SubmitSequencingJobDtoSourceTypeEnumSerializer();
Serializer<SubmitSequencingJobDtoFileFormatEnum>
    _$submitSequencingJobDtoFileFormatEnumSerializer =
    _$SubmitSequencingJobDtoFileFormatEnumSerializer();
Serializer<SubmitSequencingJobDtoLibraryTypeEnum>
    _$submitSequencingJobDtoLibraryTypeEnumSerializer =
    _$SubmitSequencingJobDtoLibraryTypeEnumSerializer();

class _$SubmitSequencingJobDtoSourceTypeEnumSerializer
    implements PrimitiveSerializer<SubmitSequencingJobDtoSourceTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'lab': 'lab',
    'ncbi': 'ncbi',
    'manual': 'manual',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'lab': 'lab',
    'ncbi': 'ncbi',
    'manual': 'manual',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    SubmitSequencingJobDtoSourceTypeEnum
  ];
  @override
  final String wireName = 'SubmitSequencingJobDtoSourceTypeEnum';

  @override
  Object serialize(
          Serializers serializers, SubmitSequencingJobDtoSourceTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SubmitSequencingJobDtoSourceTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SubmitSequencingJobDtoSourceTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SubmitSequencingJobDtoFileFormatEnumSerializer
    implements PrimitiveSerializer<SubmitSequencingJobDtoFileFormatEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'FASTA': 'FASTA',
    'FASTQ': 'FASTQ',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'FASTA': 'FASTA',
    'FASTQ': 'FASTQ',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    SubmitSequencingJobDtoFileFormatEnum
  ];
  @override
  final String wireName = 'SubmitSequencingJobDtoFileFormatEnum';

  @override
  Object serialize(
          Serializers serializers, SubmitSequencingJobDtoFileFormatEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SubmitSequencingJobDtoFileFormatEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SubmitSequencingJobDtoFileFormatEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SubmitSequencingJobDtoLibraryTypeEnumSerializer
    implements PrimitiveSerializer<SubmitSequencingJobDtoLibraryTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'singleEnd': 'Single End',
    'pairedEnd': 'Paired End',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'Single End': 'singleEnd',
    'Paired End': 'pairedEnd',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    SubmitSequencingJobDtoLibraryTypeEnum
  ];
  @override
  final String wireName = 'SubmitSequencingJobDtoLibraryTypeEnum';

  @override
  Object serialize(
          Serializers serializers, SubmitSequencingJobDtoLibraryTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  SubmitSequencingJobDtoLibraryTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      SubmitSequencingJobDtoLibraryTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$SubmitSequencingJobDto extends SubmitSequencingJobDto {
  @override
  final SubmitSequencingJobDtoSourceTypeEnum sourceType;
  @override
  final String? labTestId;
  @override
  final String? ncbiAccession;
  @override
  final String? manualSampleBarcode;
  @override
  final String? manualSiteName;
  @override
  final SubmitSequencingJobDtoFileFormatEnum? fileFormat;
  @override
  final SubmitSequencingJobDtoLibraryTypeEnum? libraryType;
  @override
  final String? platform;
  @override
  final String? sequencingMethod;
  @override
  final String? projectId;
  @override
  final String pipelineId;
  @override
  final String? inputKey;
  @override
  final String? inputFilename;
  @override
  final JsonObject? extraInputKeys;
  @override
  final JsonObject? params;

  factory _$SubmitSequencingJobDto(
          [void Function(SubmitSequencingJobDtoBuilder)? updates]) =>
      (SubmitSequencingJobDtoBuilder()..update(updates))._build();

  _$SubmitSequencingJobDto._(
      {required this.sourceType,
      this.labTestId,
      this.ncbiAccession,
      this.manualSampleBarcode,
      this.manualSiteName,
      this.fileFormat,
      this.libraryType,
      this.platform,
      this.sequencingMethod,
      this.projectId,
      required this.pipelineId,
      this.inputKey,
      this.inputFilename,
      this.extraInputKeys,
      this.params})
      : super._();
  @override
  SubmitSequencingJobDto rebuild(
          void Function(SubmitSequencingJobDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SubmitSequencingJobDtoBuilder toBuilder() =>
      SubmitSequencingJobDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SubmitSequencingJobDto &&
        sourceType == other.sourceType &&
        labTestId == other.labTestId &&
        ncbiAccession == other.ncbiAccession &&
        manualSampleBarcode == other.manualSampleBarcode &&
        manualSiteName == other.manualSiteName &&
        fileFormat == other.fileFormat &&
        libraryType == other.libraryType &&
        platform == other.platform &&
        sequencingMethod == other.sequencingMethod &&
        projectId == other.projectId &&
        pipelineId == other.pipelineId &&
        inputKey == other.inputKey &&
        inputFilename == other.inputFilename &&
        extraInputKeys == other.extraInputKeys &&
        params == other.params;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, sourceType.hashCode);
    _$hash = $jc(_$hash, labTestId.hashCode);
    _$hash = $jc(_$hash, ncbiAccession.hashCode);
    _$hash = $jc(_$hash, manualSampleBarcode.hashCode);
    _$hash = $jc(_$hash, manualSiteName.hashCode);
    _$hash = $jc(_$hash, fileFormat.hashCode);
    _$hash = $jc(_$hash, libraryType.hashCode);
    _$hash = $jc(_$hash, platform.hashCode);
    _$hash = $jc(_$hash, sequencingMethod.hashCode);
    _$hash = $jc(_$hash, projectId.hashCode);
    _$hash = $jc(_$hash, pipelineId.hashCode);
    _$hash = $jc(_$hash, inputKey.hashCode);
    _$hash = $jc(_$hash, inputFilename.hashCode);
    _$hash = $jc(_$hash, extraInputKeys.hashCode);
    _$hash = $jc(_$hash, params.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SubmitSequencingJobDto')
          ..add('sourceType', sourceType)
          ..add('labTestId', labTestId)
          ..add('ncbiAccession', ncbiAccession)
          ..add('manualSampleBarcode', manualSampleBarcode)
          ..add('manualSiteName', manualSiteName)
          ..add('fileFormat', fileFormat)
          ..add('libraryType', libraryType)
          ..add('platform', platform)
          ..add('sequencingMethod', sequencingMethod)
          ..add('projectId', projectId)
          ..add('pipelineId', pipelineId)
          ..add('inputKey', inputKey)
          ..add('inputFilename', inputFilename)
          ..add('extraInputKeys', extraInputKeys)
          ..add('params', params))
        .toString();
  }
}

class SubmitSequencingJobDtoBuilder
    implements Builder<SubmitSequencingJobDto, SubmitSequencingJobDtoBuilder> {
  _$SubmitSequencingJobDto? _$v;

  SubmitSequencingJobDtoSourceTypeEnum? _sourceType;
  SubmitSequencingJobDtoSourceTypeEnum? get sourceType => _$this._sourceType;
  set sourceType(SubmitSequencingJobDtoSourceTypeEnum? sourceType) =>
      _$this._sourceType = sourceType;

  String? _labTestId;
  String? get labTestId => _$this._labTestId;
  set labTestId(String? labTestId) => _$this._labTestId = labTestId;

  String? _ncbiAccession;
  String? get ncbiAccession => _$this._ncbiAccession;
  set ncbiAccession(String? ncbiAccession) =>
      _$this._ncbiAccession = ncbiAccession;

  String? _manualSampleBarcode;
  String? get manualSampleBarcode => _$this._manualSampleBarcode;
  set manualSampleBarcode(String? manualSampleBarcode) =>
      _$this._manualSampleBarcode = manualSampleBarcode;

  String? _manualSiteName;
  String? get manualSiteName => _$this._manualSiteName;
  set manualSiteName(String? manualSiteName) =>
      _$this._manualSiteName = manualSiteName;

  SubmitSequencingJobDtoFileFormatEnum? _fileFormat;
  SubmitSequencingJobDtoFileFormatEnum? get fileFormat => _$this._fileFormat;
  set fileFormat(SubmitSequencingJobDtoFileFormatEnum? fileFormat) =>
      _$this._fileFormat = fileFormat;

  SubmitSequencingJobDtoLibraryTypeEnum? _libraryType;
  SubmitSequencingJobDtoLibraryTypeEnum? get libraryType => _$this._libraryType;
  set libraryType(SubmitSequencingJobDtoLibraryTypeEnum? libraryType) =>
      _$this._libraryType = libraryType;

  String? _platform;
  String? get platform => _$this._platform;
  set platform(String? platform) => _$this._platform = platform;

  String? _sequencingMethod;
  String? get sequencingMethod => _$this._sequencingMethod;
  set sequencingMethod(String? sequencingMethod) =>
      _$this._sequencingMethod = sequencingMethod;

  String? _projectId;
  String? get projectId => _$this._projectId;
  set projectId(String? projectId) => _$this._projectId = projectId;

  String? _pipelineId;
  String? get pipelineId => _$this._pipelineId;
  set pipelineId(String? pipelineId) => _$this._pipelineId = pipelineId;

  String? _inputKey;
  String? get inputKey => _$this._inputKey;
  set inputKey(String? inputKey) => _$this._inputKey = inputKey;

  String? _inputFilename;
  String? get inputFilename => _$this._inputFilename;
  set inputFilename(String? inputFilename) =>
      _$this._inputFilename = inputFilename;

  JsonObject? _extraInputKeys;
  JsonObject? get extraInputKeys => _$this._extraInputKeys;
  set extraInputKeys(JsonObject? extraInputKeys) =>
      _$this._extraInputKeys = extraInputKeys;

  JsonObject? _params;
  JsonObject? get params => _$this._params;
  set params(JsonObject? params) => _$this._params = params;

  SubmitSequencingJobDtoBuilder() {
    SubmitSequencingJobDto._defaults(this);
  }

  SubmitSequencingJobDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _sourceType = $v.sourceType;
      _labTestId = $v.labTestId;
      _ncbiAccession = $v.ncbiAccession;
      _manualSampleBarcode = $v.manualSampleBarcode;
      _manualSiteName = $v.manualSiteName;
      _fileFormat = $v.fileFormat;
      _libraryType = $v.libraryType;
      _platform = $v.platform;
      _sequencingMethod = $v.sequencingMethod;
      _projectId = $v.projectId;
      _pipelineId = $v.pipelineId;
      _inputKey = $v.inputKey;
      _inputFilename = $v.inputFilename;
      _extraInputKeys = $v.extraInputKeys;
      _params = $v.params;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SubmitSequencingJobDto other) {
    _$v = other as _$SubmitSequencingJobDto;
  }

  @override
  void update(void Function(SubmitSequencingJobDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SubmitSequencingJobDto build() => _build();

  _$SubmitSequencingJobDto _build() {
    final _$result = _$v ??
        _$SubmitSequencingJobDto._(
          sourceType: BuiltValueNullFieldError.checkNotNull(
              sourceType, r'SubmitSequencingJobDto', 'sourceType'),
          labTestId: labTestId,
          ncbiAccession: ncbiAccession,
          manualSampleBarcode: manualSampleBarcode,
          manualSiteName: manualSiteName,
          fileFormat: fileFormat,
          libraryType: libraryType,
          platform: platform,
          sequencingMethod: sequencingMethod,
          projectId: projectId,
          pipelineId: BuiltValueNullFieldError.checkNotNull(
              pipelineId, r'SubmitSequencingJobDto', 'pipelineId'),
          inputKey: inputKey,
          inputFilename: inputFilename,
          extraInputKeys: extraInputKeys,
          params: params,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
