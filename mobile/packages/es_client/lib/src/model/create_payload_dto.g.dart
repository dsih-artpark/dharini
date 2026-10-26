// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_payload_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$CreatePayloadDto extends CreatePayloadDto {
  @override
  final String project;
  @override
  final String name;
  @override
  final String farmType;
  @override
  final String siteType;
  @override
  final String siteOwnerName;
  @override
  final String siteOwnerNumber;
  @override
  final num workerNumber;
  @override
  final String address;
  @override
  final String regionId;
  @override
  final String? pinCode;
  @override
  final num latitude;
  @override
  final num longitude;
  @override
  final String comment;
  @override
  final BuiltList<String> photos;

  factory _$CreatePayloadDto(
          [void Function(CreatePayloadDtoBuilder)? updates]) =>
      (CreatePayloadDtoBuilder()..update(updates))._build();

  _$CreatePayloadDto._(
      {required this.project,
      required this.name,
      required this.farmType,
      required this.siteType,
      required this.siteOwnerName,
      required this.siteOwnerNumber,
      required this.workerNumber,
      required this.address,
      required this.regionId,
      this.pinCode,
      required this.latitude,
      required this.longitude,
      required this.comment,
      required this.photos})
      : super._();
  @override
  CreatePayloadDto rebuild(void Function(CreatePayloadDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreatePayloadDtoBuilder toBuilder() =>
      CreatePayloadDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreatePayloadDto &&
        project == other.project &&
        name == other.name &&
        farmType == other.farmType &&
        siteType == other.siteType &&
        siteOwnerName == other.siteOwnerName &&
        siteOwnerNumber == other.siteOwnerNumber &&
        workerNumber == other.workerNumber &&
        address == other.address &&
        regionId == other.regionId &&
        pinCode == other.pinCode &&
        latitude == other.latitude &&
        longitude == other.longitude &&
        comment == other.comment &&
        photos == other.photos;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, farmType.hashCode);
    _$hash = $jc(_$hash, siteType.hashCode);
    _$hash = $jc(_$hash, siteOwnerName.hashCode);
    _$hash = $jc(_$hash, siteOwnerNumber.hashCode);
    _$hash = $jc(_$hash, workerNumber.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, regionId.hashCode);
    _$hash = $jc(_$hash, pinCode.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreatePayloadDto')
          ..add('project', project)
          ..add('name', name)
          ..add('farmType', farmType)
          ..add('siteType', siteType)
          ..add('siteOwnerName', siteOwnerName)
          ..add('siteOwnerNumber', siteOwnerNumber)
          ..add('workerNumber', workerNumber)
          ..add('address', address)
          ..add('regionId', regionId)
          ..add('pinCode', pinCode)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('comment', comment)
          ..add('photos', photos))
        .toString();
  }
}

class CreatePayloadDtoBuilder
    implements Builder<CreatePayloadDto, CreatePayloadDtoBuilder> {
  _$CreatePayloadDto? _$v;

  String? _project;
  String? get project => _$this._project;
  set project(String? project) => _$this._project = project;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _farmType;
  String? get farmType => _$this._farmType;
  set farmType(String? farmType) => _$this._farmType = farmType;

  String? _siteType;
  String? get siteType => _$this._siteType;
  set siteType(String? siteType) => _$this._siteType = siteType;

  String? _siteOwnerName;
  String? get siteOwnerName => _$this._siteOwnerName;
  set siteOwnerName(String? siteOwnerName) =>
      _$this._siteOwnerName = siteOwnerName;

  String? _siteOwnerNumber;
  String? get siteOwnerNumber => _$this._siteOwnerNumber;
  set siteOwnerNumber(String? siteOwnerNumber) =>
      _$this._siteOwnerNumber = siteOwnerNumber;

  num? _workerNumber;
  num? get workerNumber => _$this._workerNumber;
  set workerNumber(num? workerNumber) => _$this._workerNumber = workerNumber;

  String? _address;
  String? get address => _$this._address;
  set address(String? address) => _$this._address = address;

  String? _regionId;
  String? get regionId => _$this._regionId;
  set regionId(String? regionId) => _$this._regionId = regionId;

  String? _pinCode;
  String? get pinCode => _$this._pinCode;
  set pinCode(String? pinCode) => _$this._pinCode = pinCode;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  CreatePayloadDtoBuilder() {
    CreatePayloadDto._defaults(this);
  }

  CreatePayloadDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _project = $v.project;
      _name = $v.name;
      _farmType = $v.farmType;
      _siteType = $v.siteType;
      _siteOwnerName = $v.siteOwnerName;
      _siteOwnerNumber = $v.siteOwnerNumber;
      _workerNumber = $v.workerNumber;
      _address = $v.address;
      _regionId = $v.regionId;
      _pinCode = $v.pinCode;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _comment = $v.comment;
      _photos = $v.photos.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreatePayloadDto other) {
    _$v = other as _$CreatePayloadDto;
  }

  @override
  void update(void Function(CreatePayloadDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreatePayloadDto build() => _build();

  _$CreatePayloadDto _build() {
    _$CreatePayloadDto _$result;
    try {
      _$result = _$v ??
          _$CreatePayloadDto._(
            project: BuiltValueNullFieldError.checkNotNull(
                project, r'CreatePayloadDto', 'project'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'CreatePayloadDto', 'name'),
            farmType: BuiltValueNullFieldError.checkNotNull(
                farmType, r'CreatePayloadDto', 'farmType'),
            siteType: BuiltValueNullFieldError.checkNotNull(
                siteType, r'CreatePayloadDto', 'siteType'),
            siteOwnerName: BuiltValueNullFieldError.checkNotNull(
                siteOwnerName, r'CreatePayloadDto', 'siteOwnerName'),
            siteOwnerNumber: BuiltValueNullFieldError.checkNotNull(
                siteOwnerNumber, r'CreatePayloadDto', 'siteOwnerNumber'),
            workerNumber: BuiltValueNullFieldError.checkNotNull(
                workerNumber, r'CreatePayloadDto', 'workerNumber'),
            address: BuiltValueNullFieldError.checkNotNull(
                address, r'CreatePayloadDto', 'address'),
            regionId: BuiltValueNullFieldError.checkNotNull(
                regionId, r'CreatePayloadDto', 'regionId'),
            pinCode: pinCode,
            latitude: BuiltValueNullFieldError.checkNotNull(
                latitude, r'CreatePayloadDto', 'latitude'),
            longitude: BuiltValueNullFieldError.checkNotNull(
                longitude, r'CreatePayloadDto', 'longitude'),
            comment: BuiltValueNullFieldError.checkNotNull(
                comment, r'CreatePayloadDto', 'comment'),
            photos: photos.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'photos';
        photos.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'CreatePayloadDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
