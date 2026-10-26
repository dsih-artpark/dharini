// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sample_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$SampleDto extends SampleDto {
  @override
  final String sampleId;
  @override
  final String barcode;
  @override
  final String replicates;
  @override
  final String comment;
  @override
  final BuiltList<String> diseases;
  @override
  final BuiltList<String> photos;
  @override
  final num latitude;
  @override
  final num longitude;
  @override
  final BuiltList<LabTestDto> labTests;

  factory _$SampleDto([void Function(SampleDtoBuilder)? updates]) =>
      (SampleDtoBuilder()..update(updates))._build();

  _$SampleDto._(
      {required this.sampleId,
      required this.barcode,
      required this.replicates,
      required this.comment,
      required this.diseases,
      required this.photos,
      required this.latitude,
      required this.longitude,
      required this.labTests})
      : super._();
  @override
  SampleDto rebuild(void Function(SampleDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SampleDtoBuilder toBuilder() => SampleDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is SampleDto &&
        sampleId == other.sampleId &&
        barcode == other.barcode &&
        replicates == other.replicates &&
        comment == other.comment &&
        diseases == other.diseases &&
        photos == other.photos &&
        latitude == other.latitude &&
        longitude == other.longitude &&
        labTests == other.labTests;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, sampleId.hashCode);
    _$hash = $jc(_$hash, barcode.hashCode);
    _$hash = $jc(_$hash, replicates.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, labTests.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'SampleDto')
          ..add('sampleId', sampleId)
          ..add('barcode', barcode)
          ..add('replicates', replicates)
          ..add('comment', comment)
          ..add('diseases', diseases)
          ..add('photos', photos)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('labTests', labTests))
        .toString();
  }
}

class SampleDtoBuilder implements Builder<SampleDto, SampleDtoBuilder> {
  _$SampleDto? _$v;

  String? _sampleId;
  String? get sampleId => _$this._sampleId;
  set sampleId(String? sampleId) => _$this._sampleId = sampleId;

  String? _barcode;
  String? get barcode => _$this._barcode;
  set barcode(String? barcode) => _$this._barcode = barcode;

  String? _replicates;
  String? get replicates => _$this._replicates;
  set replicates(String? replicates) => _$this._replicates = replicates;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  ListBuilder<String>? _diseases;
  ListBuilder<String> get diseases =>
      _$this._diseases ??= ListBuilder<String>();
  set diseases(ListBuilder<String>? diseases) => _$this._diseases = diseases;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  ListBuilder<LabTestDto>? _labTests;
  ListBuilder<LabTestDto> get labTests =>
      _$this._labTests ??= ListBuilder<LabTestDto>();
  set labTests(ListBuilder<LabTestDto>? labTests) =>
      _$this._labTests = labTests;

  SampleDtoBuilder() {
    SampleDto._defaults(this);
  }

  SampleDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _sampleId = $v.sampleId;
      _barcode = $v.barcode;
      _replicates = $v.replicates;
      _comment = $v.comment;
      _diseases = $v.diseases.toBuilder();
      _photos = $v.photos.toBuilder();
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _labTests = $v.labTests.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(SampleDto other) {
    _$v = other as _$SampleDto;
  }

  @override
  void update(void Function(SampleDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  SampleDto build() => _build();

  _$SampleDto _build() {
    _$SampleDto _$result;
    try {
      _$result = _$v ??
          _$SampleDto._(
            sampleId: BuiltValueNullFieldError.checkNotNull(
                sampleId, r'SampleDto', 'sampleId'),
            barcode: BuiltValueNullFieldError.checkNotNull(
                barcode, r'SampleDto', 'barcode'),
            replicates: BuiltValueNullFieldError.checkNotNull(
                replicates, r'SampleDto', 'replicates'),
            comment: BuiltValueNullFieldError.checkNotNull(
                comment, r'SampleDto', 'comment'),
            diseases: diseases.build(),
            photos: photos.build(),
            latitude: BuiltValueNullFieldError.checkNotNull(
                latitude, r'SampleDto', 'latitude'),
            longitude: BuiltValueNullFieldError.checkNotNull(
                longitude, r'SampleDto', 'longitude'),
            labTests: labTests.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'diseases';
        diseases.build();
        _$failedField = 'photos';
        photos.build();

        _$failedField = 'labTests';
        labTests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'SampleDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
