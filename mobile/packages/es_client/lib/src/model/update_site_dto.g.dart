// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_site_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateSiteDto extends UpdateSiteDto {
  @override
  final BuiltList<DayOfWeek>? collectionDayOfWeek;
  @override
  final DateTime? collectionStartDate;
  @override
  final String? farmType;
  @override
  final SiteType? siteType;
  @override
  final BuiltList<String> photos;
  @override
  final String regionId;
  @override
  final num latitude;
  @override
  final num longitude;
  @override
  final String collectionCollector;
  @override
  final String? collectionConsent;
  @override
  final String name;
  @override
  final num? collectionFrequencyInterval;
  @override
  final num? collectionFrequency;
  @override
  final String? collectionTime;
  @override
  final num? collectionDuration;
  @override
  final String? siteOwnerName;
  @override
  final String? siteOwnerNumber;
  @override
  final num? workerNumber;
  @override
  final String? address;
  @override
  final num? pinCode;
  @override
  final String? comment;
  @override
  final String? block;
  @override
  final String? village;

  factory _$UpdateSiteDto([void Function(UpdateSiteDtoBuilder)? updates]) =>
      (UpdateSiteDtoBuilder()..update(updates))._build();

  _$UpdateSiteDto._(
      {this.collectionDayOfWeek,
      this.collectionStartDate,
      this.farmType,
      this.siteType,
      required this.photos,
      required this.regionId,
      required this.latitude,
      required this.longitude,
      required this.collectionCollector,
      this.collectionConsent,
      required this.name,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      this.collectionTime,
      this.collectionDuration,
      this.siteOwnerName,
      this.siteOwnerNumber,
      this.workerNumber,
      this.address,
      this.pinCode,
      this.comment,
      this.block,
      this.village})
      : super._();
  @override
  UpdateSiteDto rebuild(void Function(UpdateSiteDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateSiteDtoBuilder toBuilder() => UpdateSiteDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateSiteDto &&
        collectionDayOfWeek == other.collectionDayOfWeek &&
        collectionStartDate == other.collectionStartDate &&
        farmType == other.farmType &&
        siteType == other.siteType &&
        photos == other.photos &&
        regionId == other.regionId &&
        latitude == other.latitude &&
        longitude == other.longitude &&
        collectionCollector == other.collectionCollector &&
        collectionConsent == other.collectionConsent &&
        name == other.name &&
        collectionFrequencyInterval == other.collectionFrequencyInterval &&
        collectionFrequency == other.collectionFrequency &&
        collectionTime == other.collectionTime &&
        collectionDuration == other.collectionDuration &&
        siteOwnerName == other.siteOwnerName &&
        siteOwnerNumber == other.siteOwnerNumber &&
        workerNumber == other.workerNumber &&
        address == other.address &&
        pinCode == other.pinCode &&
        comment == other.comment &&
        block == other.block &&
        village == other.village;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, collectionDayOfWeek.hashCode);
    _$hash = $jc(_$hash, collectionStartDate.hashCode);
    _$hash = $jc(_$hash, farmType.hashCode);
    _$hash = $jc(_$hash, siteType.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, regionId.hashCode);
    _$hash = $jc(_$hash, latitude.hashCode);
    _$hash = $jc(_$hash, longitude.hashCode);
    _$hash = $jc(_$hash, collectionCollector.hashCode);
    _$hash = $jc(_$hash, collectionConsent.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, collectionFrequencyInterval.hashCode);
    _$hash = $jc(_$hash, collectionFrequency.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jc(_$hash, collectionDuration.hashCode);
    _$hash = $jc(_$hash, siteOwnerName.hashCode);
    _$hash = $jc(_$hash, siteOwnerNumber.hashCode);
    _$hash = $jc(_$hash, workerNumber.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, pinCode.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, block.hashCode);
    _$hash = $jc(_$hash, village.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateSiteDto')
          ..add('collectionDayOfWeek', collectionDayOfWeek)
          ..add('collectionStartDate', collectionStartDate)
          ..add('farmType', farmType)
          ..add('siteType', siteType)
          ..add('photos', photos)
          ..add('regionId', regionId)
          ..add('latitude', latitude)
          ..add('longitude', longitude)
          ..add('collectionCollector', collectionCollector)
          ..add('collectionConsent', collectionConsent)
          ..add('name', name)
          ..add('collectionFrequencyInterval', collectionFrequencyInterval)
          ..add('collectionFrequency', collectionFrequency)
          ..add('collectionTime', collectionTime)
          ..add('collectionDuration', collectionDuration)
          ..add('siteOwnerName', siteOwnerName)
          ..add('siteOwnerNumber', siteOwnerNumber)
          ..add('workerNumber', workerNumber)
          ..add('address', address)
          ..add('pinCode', pinCode)
          ..add('comment', comment)
          ..add('block', block)
          ..add('village', village))
        .toString();
  }
}

class UpdateSiteDtoBuilder
    implements Builder<UpdateSiteDto, UpdateSiteDtoBuilder> {
  _$UpdateSiteDto? _$v;

  ListBuilder<DayOfWeek>? _collectionDayOfWeek;
  ListBuilder<DayOfWeek> get collectionDayOfWeek =>
      _$this._collectionDayOfWeek ??= ListBuilder<DayOfWeek>();
  set collectionDayOfWeek(ListBuilder<DayOfWeek>? collectionDayOfWeek) =>
      _$this._collectionDayOfWeek = collectionDayOfWeek;

  DateTime? _collectionStartDate;
  DateTime? get collectionStartDate => _$this._collectionStartDate;
  set collectionStartDate(DateTime? collectionStartDate) =>
      _$this._collectionStartDate = collectionStartDate;

  String? _farmType;
  String? get farmType => _$this._farmType;
  set farmType(String? farmType) => _$this._farmType = farmType;

  SiteType? _siteType;
  SiteType? get siteType => _$this._siteType;
  set siteType(SiteType? siteType) => _$this._siteType = siteType;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

  String? _regionId;
  String? get regionId => _$this._regionId;
  set regionId(String? regionId) => _$this._regionId = regionId;

  num? _latitude;
  num? get latitude => _$this._latitude;
  set latitude(num? latitude) => _$this._latitude = latitude;

  num? _longitude;
  num? get longitude => _$this._longitude;
  set longitude(num? longitude) => _$this._longitude = longitude;

  String? _collectionCollector;
  String? get collectionCollector => _$this._collectionCollector;
  set collectionCollector(String? collectionCollector) =>
      _$this._collectionCollector = collectionCollector;

  String? _collectionConsent;
  String? get collectionConsent => _$this._collectionConsent;
  set collectionConsent(String? collectionConsent) =>
      _$this._collectionConsent = collectionConsent;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  num? _collectionFrequencyInterval;
  num? get collectionFrequencyInterval => _$this._collectionFrequencyInterval;
  set collectionFrequencyInterval(num? collectionFrequencyInterval) =>
      _$this._collectionFrequencyInterval = collectionFrequencyInterval;

  num? _collectionFrequency;
  num? get collectionFrequency => _$this._collectionFrequency;
  set collectionFrequency(num? collectionFrequency) =>
      _$this._collectionFrequency = collectionFrequency;

  String? _collectionTime;
  String? get collectionTime => _$this._collectionTime;
  set collectionTime(String? collectionTime) =>
      _$this._collectionTime = collectionTime;

  num? _collectionDuration;
  num? get collectionDuration => _$this._collectionDuration;
  set collectionDuration(num? collectionDuration) =>
      _$this._collectionDuration = collectionDuration;

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

  num? _pinCode;
  num? get pinCode => _$this._pinCode;
  set pinCode(num? pinCode) => _$this._pinCode = pinCode;

  String? _comment;
  String? get comment => _$this._comment;
  set comment(String? comment) => _$this._comment = comment;

  String? _block;
  String? get block => _$this._block;
  set block(String? block) => _$this._block = block;

  String? _village;
  String? get village => _$this._village;
  set village(String? village) => _$this._village = village;

  UpdateSiteDtoBuilder() {
    UpdateSiteDto._defaults(this);
  }

  UpdateSiteDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _collectionDayOfWeek = $v.collectionDayOfWeek?.toBuilder();
      _collectionStartDate = $v.collectionStartDate;
      _farmType = $v.farmType;
      _siteType = $v.siteType;
      _photos = $v.photos.toBuilder();
      _regionId = $v.regionId;
      _latitude = $v.latitude;
      _longitude = $v.longitude;
      _collectionCollector = $v.collectionCollector;
      _collectionConsent = $v.collectionConsent;
      _name = $v.name;
      _collectionFrequencyInterval = $v.collectionFrequencyInterval;
      _collectionFrequency = $v.collectionFrequency;
      _collectionTime = $v.collectionTime;
      _collectionDuration = $v.collectionDuration;
      _siteOwnerName = $v.siteOwnerName;
      _siteOwnerNumber = $v.siteOwnerNumber;
      _workerNumber = $v.workerNumber;
      _address = $v.address;
      _pinCode = $v.pinCode;
      _comment = $v.comment;
      _block = $v.block;
      _village = $v.village;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateSiteDto other) {
    _$v = other as _$UpdateSiteDto;
  }

  @override
  void update(void Function(UpdateSiteDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateSiteDto build() => _build();

  _$UpdateSiteDto _build() {
    _$UpdateSiteDto _$result;
    try {
      _$result = _$v ??
          _$UpdateSiteDto._(
            collectionDayOfWeek: _collectionDayOfWeek?.build(),
            collectionStartDate: collectionStartDate,
            farmType: farmType,
            siteType: siteType,
            photos: photos.build(),
            regionId: BuiltValueNullFieldError.checkNotNull(
                regionId, r'UpdateSiteDto', 'regionId'),
            latitude: BuiltValueNullFieldError.checkNotNull(
                latitude, r'UpdateSiteDto', 'latitude'),
            longitude: BuiltValueNullFieldError.checkNotNull(
                longitude, r'UpdateSiteDto', 'longitude'),
            collectionCollector: BuiltValueNullFieldError.checkNotNull(
                collectionCollector, r'UpdateSiteDto', 'collectionCollector'),
            collectionConsent: collectionConsent,
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'UpdateSiteDto', 'name'),
            collectionFrequencyInterval: collectionFrequencyInterval,
            collectionFrequency: collectionFrequency,
            collectionTime: collectionTime,
            collectionDuration: collectionDuration,
            siteOwnerName: siteOwnerName,
            siteOwnerNumber: siteOwnerNumber,
            workerNumber: workerNumber,
            address: address,
            pinCode: pinCode,
            comment: comment,
            block: block,
            village: village,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'collectionDayOfWeek';
        _collectionDayOfWeek?.build();

        _$failedField = 'photos';
        photos.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UpdateSiteDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
