// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Site extends Site {
  @override
  final BuiltList<DayOfWeek>? collectionDayOfWeek;
  @override
  final FarmType? farmType;
  @override
  final SiteType? siteType;
  @override
  final String id;
  @override
  final String name;
  @override
  final String? siteCode;
  @override
  final String? collectionConsent;
  @override
  final num? collectionFrequencyInterval;
  @override
  final num? collectionFrequency;
  @override
  final String? collectionTime;
  @override
  final DateTime? collectionStartDate;
  @override
  final DateTime? collectionLastScheduleDate;
  @override
  final num? collectionDuration;
  @override
  final DateTime? collectionExpiryDate;
  @override
  final BuiltList<String>? photos;
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
  final DateTime createdAt;

  factory _$Site([void Function(SiteBuilder)? updates]) =>
      (SiteBuilder()..update(updates))._build();

  _$Site._(
      {this.collectionDayOfWeek,
      this.farmType,
      this.siteType,
      required this.id,
      required this.name,
      this.siteCode,
      this.collectionConsent,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      this.collectionTime,
      this.collectionStartDate,
      this.collectionLastScheduleDate,
      this.collectionDuration,
      this.collectionExpiryDate,
      this.photos,
      this.siteOwnerName,
      this.siteOwnerNumber,
      this.workerNumber,
      this.address,
      this.pinCode,
      this.comment,
      required this.createdAt})
      : super._();
  @override
  Site rebuild(void Function(SiteBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  SiteBuilder toBuilder() => SiteBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Site &&
        collectionDayOfWeek == other.collectionDayOfWeek &&
        farmType == other.farmType &&
        siteType == other.siteType &&
        id == other.id &&
        name == other.name &&
        siteCode == other.siteCode &&
        collectionConsent == other.collectionConsent &&
        collectionFrequencyInterval == other.collectionFrequencyInterval &&
        collectionFrequency == other.collectionFrequency &&
        collectionTime == other.collectionTime &&
        collectionStartDate == other.collectionStartDate &&
        collectionLastScheduleDate == other.collectionLastScheduleDate &&
        collectionDuration == other.collectionDuration &&
        collectionExpiryDate == other.collectionExpiryDate &&
        photos == other.photos &&
        siteOwnerName == other.siteOwnerName &&
        siteOwnerNumber == other.siteOwnerNumber &&
        workerNumber == other.workerNumber &&
        address == other.address &&
        pinCode == other.pinCode &&
        comment == other.comment &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, collectionDayOfWeek.hashCode);
    _$hash = $jc(_$hash, farmType.hashCode);
    _$hash = $jc(_$hash, siteType.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, siteCode.hashCode);
    _$hash = $jc(_$hash, collectionConsent.hashCode);
    _$hash = $jc(_$hash, collectionFrequencyInterval.hashCode);
    _$hash = $jc(_$hash, collectionFrequency.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
    _$hash = $jc(_$hash, collectionStartDate.hashCode);
    _$hash = $jc(_$hash, collectionLastScheduleDate.hashCode);
    _$hash = $jc(_$hash, collectionDuration.hashCode);
    _$hash = $jc(_$hash, collectionExpiryDate.hashCode);
    _$hash = $jc(_$hash, photos.hashCode);
    _$hash = $jc(_$hash, siteOwnerName.hashCode);
    _$hash = $jc(_$hash, siteOwnerNumber.hashCode);
    _$hash = $jc(_$hash, workerNumber.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, pinCode.hashCode);
    _$hash = $jc(_$hash, comment.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Site')
          ..add('collectionDayOfWeek', collectionDayOfWeek)
          ..add('farmType', farmType)
          ..add('siteType', siteType)
          ..add('id', id)
          ..add('name', name)
          ..add('siteCode', siteCode)
          ..add('collectionConsent', collectionConsent)
          ..add('collectionFrequencyInterval', collectionFrequencyInterval)
          ..add('collectionFrequency', collectionFrequency)
          ..add('collectionTime', collectionTime)
          ..add('collectionStartDate', collectionStartDate)
          ..add('collectionLastScheduleDate', collectionLastScheduleDate)
          ..add('collectionDuration', collectionDuration)
          ..add('collectionExpiryDate', collectionExpiryDate)
          ..add('photos', photos)
          ..add('siteOwnerName', siteOwnerName)
          ..add('siteOwnerNumber', siteOwnerNumber)
          ..add('workerNumber', workerNumber)
          ..add('address', address)
          ..add('pinCode', pinCode)
          ..add('comment', comment)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class SiteBuilder implements Builder<Site, SiteBuilder> {
  _$Site? _$v;

  ListBuilder<DayOfWeek>? _collectionDayOfWeek;
  ListBuilder<DayOfWeek> get collectionDayOfWeek =>
      _$this._collectionDayOfWeek ??= ListBuilder<DayOfWeek>();
  set collectionDayOfWeek(ListBuilder<DayOfWeek>? collectionDayOfWeek) =>
      _$this._collectionDayOfWeek = collectionDayOfWeek;

  FarmType? _farmType;
  FarmType? get farmType => _$this._farmType;
  set farmType(FarmType? farmType) => _$this._farmType = farmType;

  SiteType? _siteType;
  SiteType? get siteType => _$this._siteType;
  set siteType(SiteType? siteType) => _$this._siteType = siteType;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  String? _siteCode;
  String? get siteCode => _$this._siteCode;
  set siteCode(String? siteCode) => _$this._siteCode = siteCode;

  String? _collectionConsent;
  String? get collectionConsent => _$this._collectionConsent;
  set collectionConsent(String? collectionConsent) =>
      _$this._collectionConsent = collectionConsent;

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

  DateTime? _collectionStartDate;
  DateTime? get collectionStartDate => _$this._collectionStartDate;
  set collectionStartDate(DateTime? collectionStartDate) =>
      _$this._collectionStartDate = collectionStartDate;

  DateTime? _collectionLastScheduleDate;
  DateTime? get collectionLastScheduleDate =>
      _$this._collectionLastScheduleDate;
  set collectionLastScheduleDate(DateTime? collectionLastScheduleDate) =>
      _$this._collectionLastScheduleDate = collectionLastScheduleDate;

  num? _collectionDuration;
  num? get collectionDuration => _$this._collectionDuration;
  set collectionDuration(num? collectionDuration) =>
      _$this._collectionDuration = collectionDuration;

  DateTime? _collectionExpiryDate;
  DateTime? get collectionExpiryDate => _$this._collectionExpiryDate;
  set collectionExpiryDate(DateTime? collectionExpiryDate) =>
      _$this._collectionExpiryDate = collectionExpiryDate;

  ListBuilder<String>? _photos;
  ListBuilder<String> get photos => _$this._photos ??= ListBuilder<String>();
  set photos(ListBuilder<String>? photos) => _$this._photos = photos;

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

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  SiteBuilder() {
    Site._defaults(this);
  }

  SiteBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _collectionDayOfWeek = $v.collectionDayOfWeek?.toBuilder();
      _farmType = $v.farmType;
      _siteType = $v.siteType;
      _id = $v.id;
      _name = $v.name;
      _siteCode = $v.siteCode;
      _collectionConsent = $v.collectionConsent;
      _collectionFrequencyInterval = $v.collectionFrequencyInterval;
      _collectionFrequency = $v.collectionFrequency;
      _collectionTime = $v.collectionTime;
      _collectionStartDate = $v.collectionStartDate;
      _collectionLastScheduleDate = $v.collectionLastScheduleDate;
      _collectionDuration = $v.collectionDuration;
      _collectionExpiryDate = $v.collectionExpiryDate;
      _photos = $v.photos?.toBuilder();
      _siteOwnerName = $v.siteOwnerName;
      _siteOwnerNumber = $v.siteOwnerNumber;
      _workerNumber = $v.workerNumber;
      _address = $v.address;
      _pinCode = $v.pinCode;
      _comment = $v.comment;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Site other) {
    _$v = other as _$Site;
  }

  @override
  void update(void Function(SiteBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Site build() => _build();

  _$Site _build() {
    _$Site _$result;
    try {
      _$result = _$v ??
          _$Site._(
            collectionDayOfWeek: _collectionDayOfWeek?.build(),
            farmType: farmType,
            siteType: siteType,
            id: BuiltValueNullFieldError.checkNotNull(id, r'Site', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(name, r'Site', 'name'),
            siteCode: siteCode,
            collectionConsent: collectionConsent,
            collectionFrequencyInterval: collectionFrequencyInterval,
            collectionFrequency: collectionFrequency,
            collectionTime: collectionTime,
            collectionStartDate: collectionStartDate,
            collectionLastScheduleDate: collectionLastScheduleDate,
            collectionDuration: collectionDuration,
            collectionExpiryDate: collectionExpiryDate,
            photos: _photos?.build(),
            siteOwnerName: siteOwnerName,
            siteOwnerNumber: siteOwnerNumber,
            workerNumber: workerNumber,
            address: address,
            pinCode: pinCode,
            comment: comment,
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'Site', 'createdAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'collectionDayOfWeek';
        _collectionDayOfWeek?.build();

        _$failedField = 'photos';
        _photos?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(r'Site', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
