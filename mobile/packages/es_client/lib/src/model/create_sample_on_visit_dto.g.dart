// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_sample_on_visit_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateSampleOnVisitDtoReplicatesEnum
    _$createSampleOnVisitDtoReplicatesEnum_available =
    const CreateSampleOnVisitDtoReplicatesEnum._('available');
const CreateSampleOnVisitDtoReplicatesEnum
    _$createSampleOnVisitDtoReplicatesEnum_notCollected =
    const CreateSampleOnVisitDtoReplicatesEnum._('notCollected');
const CreateSampleOnVisitDtoReplicatesEnum
    _$createSampleOnVisitDtoReplicatesEnum_unknownDefaultOpenApi =
    const CreateSampleOnVisitDtoReplicatesEnum._('unknownDefaultOpenApi');

CreateSampleOnVisitDtoReplicatesEnum
    _$createSampleOnVisitDtoReplicatesEnumValueOf(String name) {
  switch (name) {
    case 'available':
      return _$createSampleOnVisitDtoReplicatesEnum_available;
    case 'notCollected':
      return _$createSampleOnVisitDtoReplicatesEnum_notCollected;
    case 'unknownDefaultOpenApi':
      return _$createSampleOnVisitDtoReplicatesEnum_unknownDefaultOpenApi;
    default:
      return _$createSampleOnVisitDtoReplicatesEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateSampleOnVisitDtoReplicatesEnum>
    _$createSampleOnVisitDtoReplicatesEnumValues = BuiltSet<
        CreateSampleOnVisitDtoReplicatesEnum>(const <CreateSampleOnVisitDtoReplicatesEnum>[
  _$createSampleOnVisitDtoReplicatesEnum_available,
  _$createSampleOnVisitDtoReplicatesEnum_notCollected,
  _$createSampleOnVisitDtoReplicatesEnum_unknownDefaultOpenApi,
]);

const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_pending =
    const CreateSampleOnVisitDtoSampleStatusEnum._('pending');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_pickedUp =
    const CreateSampleOnVisitDtoSampleStatusEnum._('pickedUp');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_received =
    const CreateSampleOnVisitDtoSampleStatusEnum._('received');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_preProcessed =
    const CreateSampleOnVisitDtoSampleStatusEnum._('preProcessed');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_virusIsolation =
    const CreateSampleOnVisitDtoSampleStatusEnum._('virusIsolation');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_extracted =
    const CreateSampleOnVisitDtoSampleStatusEnum._('extracted');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_tested =
    const CreateSampleOnVisitDtoSampleStatusEnum._('tested');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_rejected =
    const CreateSampleOnVisitDtoSampleStatusEnum._('rejected');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_testReportGenerated =
    const CreateSampleOnVisitDtoSampleStatusEnum._('testReportGenerated');
const CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnum_unknownDefaultOpenApi =
    const CreateSampleOnVisitDtoSampleStatusEnum._('unknownDefaultOpenApi');

CreateSampleOnVisitDtoSampleStatusEnum
    _$createSampleOnVisitDtoSampleStatusEnumValueOf(String name) {
  switch (name) {
    case 'pending':
      return _$createSampleOnVisitDtoSampleStatusEnum_pending;
    case 'pickedUp':
      return _$createSampleOnVisitDtoSampleStatusEnum_pickedUp;
    case 'received':
      return _$createSampleOnVisitDtoSampleStatusEnum_received;
    case 'preProcessed':
      return _$createSampleOnVisitDtoSampleStatusEnum_preProcessed;
    case 'virusIsolation':
      return _$createSampleOnVisitDtoSampleStatusEnum_virusIsolation;
    case 'extracted':
      return _$createSampleOnVisitDtoSampleStatusEnum_extracted;
    case 'tested':
      return _$createSampleOnVisitDtoSampleStatusEnum_tested;
    case 'rejected':
      return _$createSampleOnVisitDtoSampleStatusEnum_rejected;
    case 'testReportGenerated':
      return _$createSampleOnVisitDtoSampleStatusEnum_testReportGenerated;
    case 'unknownDefaultOpenApi':
      return _$createSampleOnVisitDtoSampleStatusEnum_unknownDefaultOpenApi;
    default:
      return _$createSampleOnVisitDtoSampleStatusEnum_unknownDefaultOpenApi;
  }
}

final BuiltSet<CreateSampleOnVisitDtoSampleStatusEnum>
    _$createSampleOnVisitDtoSampleStatusEnumValues = BuiltSet<
        CreateSampleOnVisitDtoSampleStatusEnum>(const <CreateSampleOnVisitDtoSampleStatusEnum>[
  _$createSampleOnVisitDtoSampleStatusEnum_pending,
  _$createSampleOnVisitDtoSampleStatusEnum_pickedUp,
  _$createSampleOnVisitDtoSampleStatusEnum_received,
  _$createSampleOnVisitDtoSampleStatusEnum_preProcessed,
  _$createSampleOnVisitDtoSampleStatusEnum_virusIsolation,
  _$createSampleOnVisitDtoSampleStatusEnum_extracted,
  _$createSampleOnVisitDtoSampleStatusEnum_tested,
  _$createSampleOnVisitDtoSampleStatusEnum_rejected,
  _$createSampleOnVisitDtoSampleStatusEnum_testReportGenerated,
  _$createSampleOnVisitDtoSampleStatusEnum_unknownDefaultOpenApi,
]);

Serializer<CreateSampleOnVisitDtoReplicatesEnum>
    _$createSampleOnVisitDtoReplicatesEnumSerializer =
    _$CreateSampleOnVisitDtoReplicatesEnumSerializer();
Serializer<CreateSampleOnVisitDtoSampleStatusEnum>
    _$createSampleOnVisitDtoSampleStatusEnumSerializer =
    _$CreateSampleOnVisitDtoSampleStatusEnumSerializer();

class _$CreateSampleOnVisitDtoReplicatesEnumSerializer
    implements PrimitiveSerializer<CreateSampleOnVisitDtoReplicatesEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'available': 'available',
    'notCollected': 'not collected',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'available': 'available',
    'not collected': 'notCollected',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    CreateSampleOnVisitDtoReplicatesEnum
  ];
  @override
  final String wireName = 'CreateSampleOnVisitDtoReplicatesEnum';

  @override
  Object serialize(
          Serializers serializers, CreateSampleOnVisitDtoReplicatesEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateSampleOnVisitDtoReplicatesEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateSampleOnVisitDtoReplicatesEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateSampleOnVisitDtoSampleStatusEnumSerializer
    implements PrimitiveSerializer<CreateSampleOnVisitDtoSampleStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'pickedUp': 'picked-up',
    'received': 'received',
    'preProcessed': 'pre-processed',
    'virusIsolation': 'virus-isolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'testReportGenerated': 'test-report-generated',
    'unknownDefaultOpenApi': 'unknown_default_open_api',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'picked-up': 'pickedUp',
    'received': 'received',
    'pre-processed': 'preProcessed',
    'virus-isolation': 'virusIsolation',
    'extracted': 'extracted',
    'tested': 'tested',
    'rejected': 'rejected',
    'test-report-generated': 'testReportGenerated',
    'unknown_default_open_api': 'unknownDefaultOpenApi',
  };

  @override
  final Iterable<Type> types = const <Type>[
    CreateSampleOnVisitDtoSampleStatusEnum
  ];
  @override
  final String wireName = 'CreateSampleOnVisitDtoSampleStatusEnum';

  @override
  Object serialize(Serializers serializers,
          CreateSampleOnVisitDtoSampleStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateSampleOnVisitDtoSampleStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateSampleOnVisitDtoSampleStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateSampleOnVisitDto extends CreateSampleOnVisitDto {
  @override
  final num? quantity;
  @override
  final CreateSampleOnVisitDtoReplicatesEnum replicates;
  @override
  final String? unit;
  @override
  final BuiltList<String>? photos;
  @override
  final String barcode;
  @override
  final String? originalSampleBarcode;
  @override
  final BuiltList<JsonObject> diseases;
  @override
  final DateTime? testDate;
  @override
  final JsonObject collectedBy;
  @override
  final String? location;
  @override
  final CreateSampleOnVisitDtoSampleStatusEnum? sampleStatus;
  @override
  final String? testedBy;
  @override
  final String? comment;
  @override
  final JsonObject sampleType;
  @override
  final JsonObject? species;
  @override
  final JsonObject? details;

  factory _$CreateSampleOnVisitDto(
          [void Function(CreateSampleOnVisitDtoBuilder)? updates]) =>
      (CreateSampleOnVisitDtoBuilder()..update(updates))._build();

  _$CreateSampleOnVisitDto._(
      {this.quantity,
      required this.replicates,
      this.unit,
      this.photos,
      required this.barcode,
      this.originalSampleBarcode,
      required this.diseases,
      this.testDate,
      required this.collectedBy,
      this.location,
      this.sampleStatus,
      this.testedBy,
      this.comment,
      required this.sampleType,
      this.species,
      this.details})
      : super._();
  @override
  CreateSampleOnVisitDto rebuild(
          void Function(CreateSampleOnVisitDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateSampleOnVisitDtoBuilder toBuilder() =>
      CreateSampleOnVisitDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateSampleOnVisitDto &&
        quantity == other.quantity &&
        replicates == other.replicates &&
        unit == other.unit &&
        photos == other.photos &&
        barcode == other.barcode &&
        originalSampleBarcode == other.originalSampleBarcode &&
        diseases == other.diseases &&
        testDate == other.testDate &&
        collectedBy == other.collectedBy &&
        location == other.location &&
        sampleStatus == other.sampleStatus &&
        testedBy == other.testedBy &&
        comment == other.comment &&
        sampleType == other.sampleType &&
        species == other.species &&
        details == other.details;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, quantity.hashCode);
    _$hash = $jc(_$hash, replicates.hashCode);
    _$hash = $jc(_$hash, unit.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, originalSampleBarcode.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, testDate.hashCode);
    _$hash = $jc(_$hash, collectedBy.hashCode);
    _$hash = $jc(_$hash, location.hashCode);
    _$hash = $jc(_$hash, sampleStatus.hashCode);
    _$hash = $jc(_$hash, testedBy.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, sampleType.hashCode);
    _$hash = $jc(_$hash, species.hashCode);
    _$hash = $jc(_$hash, details.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateSampleOnVisitDto')
          ..add('quantity', quantity)
          ..add('replicates', replicates)
          ..add('unit', unit)
          ..add('photos', photos)
          ..add('barcode', barcode)
          ..add('originalSampleBarcode', originalSampleBarcode)
          ..add('diseases', diseases)
          ..add('testDate', testDate)
          ..add('collectedBy', collectedBy)
          ..add('location', location)
          ..add('sampleStatus', sampleStatus)
          ..add('testedBy', testedBy)
          ..add('comment', comment)
          ..add('sampleType', sampleType)
          ..add('species', species)
          ..add('details', details))
        .toString();
  }
}

class CreateSampleOnVisitDtoBuilder
    implements Builder<CreateSampleOnVisitDto, CreateSampleOnVisitDtoBuilder> {
  _$CreateSampleOnVisitDto? _$v;

  num? _quantity;
  num? get quantity => _$this._quantity;
  set quantity(num? quantity) => _$this._quantity = quantity;

  CreateSampleOnVisitDtoReplicatesEnum? _replicates;
  CreateSampleOnVisitDtoReplicatesEnum? get replicates => _$this._replicates;
  set replicates(CreateSampleOnVisitDtoReplicatesEnum? replicates) =>
      _$this._replicates = replicates;

  String? _unit;
  String? get unit => _$this._unit;
  set unit(String? unit) => _$this._unit = unit;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  String? _originalSampleBarcode;
  String? get originalSampleBarcode => _$this._originalSampleBarcode;
  set originalSampleBarcode(String? originalSampleBarcode) =>
      _$this._originalSampleBarcode = originalSampleBarcode;

  ListBuilder<JsonObject>? _diseases;
  ListBuilder<JsonObject> get diseases =>
      _$this._diseases ??= ListBuilder<JsonObject>();
  set diseases(ListBuilder<JsonObject>? diseases) =>
      _$this._diseases = diseases;

  DateTime? _testDate;
  DateTime? get testDate => _$this._testDate;
  set testDate(DateTime? testDate) => _$this._testDate = testDate;

  JsonObject? _collectedBy;
  JsonObject? get collectedBy => _$this._collectedBy;
  set collectedBy(JsonObject? collectedBy) => _$this._collectedBy = collectedBy;

  String? _location;
  String? get location => _$this._location;
  set location(String? location) => _$this._location = location;

  CreateSampleOnVisitDtoSampleStatusEnum? _sampleStatus;
  CreateSampleOnVisitDtoSampleStatusEnum? get sampleStatus =>
      _$this._sampleStatus;
  set sampleStatus(CreateSampleOnVisitDtoSampleStatusEnum? sampleStatus) =>
      _$this._sampleStatus = sampleStatus;

  String? _testedBy;
  String? get testedBy => _$this._testedBy;
  set testedBy(String? testedBy) => _$this._testedBy = testedBy;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  JsonObject? _sampleType;
  JsonObject? get sampleType => _$this._sampleType;
  set sampleType(JsonObject? sampleType) => _$this._sampleType = sampleType;

  JsonObject? _species;
  JsonObject? get species => _$this._species;
  set species(JsonObject? species) => _$this._species = species;

  JsonObject? _details;
  JsonObject? get details => _$this._details;
  set details(JsonObject? details) => _$this._details = details;

  CreateSampleOnVisitDtoBuilder() {
    CreateSampleOnVisitDto._defaults(this);
  }

  CreateSampleOnVisitDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _quantity = $v.quantity;
      _replicates = $v.replicates;
      _unit = $v.unit;
      _photos = $v.photos?.toBuilder();
      _barcode = $v.barcode;
      _originalSampleBarcode = $v.originalSampleBarcode;
      _diseases = $v.diseases.toBuilder();
      _testDate = $v.testDate;
      _collectedBy = $v.collectedBy;
      _location = $v.location;
      _sampleStatus = $v.sampleStatus;
      _testedBy = $v.testedBy;
      _comment = $v.comment;
      _sampleType = $v.sampleType;
      _species = $v.species;
      _details = $v.details;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateSampleOnVisitDto other) {
    _$v = other as _$CreateSampleOnVisitDto;
  }

  @override
  void update(void Function(CreateSampleOnVisitDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateSampleOnVisitDto build() => _build();

  _$CreateSampleOnVisitDto _build() {
    _$CreateSampleOnVisitDto _$result;
    try {
      _$result = _$v ??
          _$CreateSampleOnVisitDto._(
            quantity: quantity,
            replicates: BuiltValueNullFieldError.checkNotNull(
                replicates, r'CreateSampleOnVisitDto', 'replicates'),
            unit: unit,
            photos: _photos?.build(),
            barcode: BuiltValueNullFieldError.checkNotNull(
                barcode, r'CreateSampleOnVisitDto', 'barcode'),
            originalSampleBarcode: originalSampleBarcode,
            diseases: diseases.build(),
            testDate: testDate,
            collectedBy: BuiltValueNullFieldError.checkNotNull(
                collectedBy, r'CreateSampleOnVisitDto', 'collectedBy'),
            location: location,
            sampleStatus: sampleStatus,
            testedBy: testedBy,
            comment: comment,
            sampleType: BuiltValueNullFieldError.checkNotNull(
                sampleType, r'CreateSampleOnVisitDto', 'sampleType'),
            species: species,
            details: details,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        _photos?.build();

        _$failedField = 'diseases';
        diseases.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreateSampleOnVisitDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
