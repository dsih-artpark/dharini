// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'nearby_site_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$NearbySiteResponseData extends NearbySiteResponseData {
  @override
  final BuiltList<DayOfWeek>? collectionDayOfWeek;
  @override
  final DateTime? collectionStartDate;
  @override
  final String? farmType;
  @override
  final String? siteSubType;
  @override
  final SiteType? siteType;
  @override
  final BuiltList<Disease> diseases;
  @override
  final User? collectionCollector;
  @override
  final UserWithTeamResponse? createdBy;
  @override
  final Location? location;
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
  @override
  final num distance;

  factory _$NearbySiteResponseData(
          [void Function(NearbySiteResponseDataBuilder)? updates]) =>
      (NearbySiteResponseDataBuilder()..update(updates))._build();

  _$NearbySiteResponseData._(
      {this.collectionDayOfWeek,
      this.collectionStartDate,
      this.farmType,
      this.siteSubType,
      this.siteType,
      required this.diseases,
      this.collectionCollector,
      this.createdBy,
      this.location,
      required this.id,
      required this.name,
      this.siteCode,
      this.collectionConsent,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      this.collectionTime,
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
      required this.createdAt,
      required this.distance})
      : super._();
  @override
  NearbySiteResponseData rebuild(
          void Function(NearbySiteResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NearbySiteResponseDataBuilder toBuilder() =>
      NearbySiteResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is NearbySiteResponseData &&
        collectionDayOfWeek == other.collectionDayOfWeek &&
        collectionStartDate == other.collectionStartDate &&
        farmType == other.farmType &&
        siteSubType == other.siteSubType &&
        siteType == other.siteType &&
        diseases == other.diseases &&
        collectionCollector == other.collectionCollector &&
        createdBy == other.createdBy &&
        location == other.location &&
        id == other.id &&
        name == other.name &&
        siteCode == other.siteCode &&
        collectionConsent == other.collectionConsent &&
        collectionFrequencyInterval == other.collectionFrequencyInterval &&
        collectionFrequency == other.collectionFrequency &&
        collectionTime == other.collectionTime &&
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
        createdAt == other.createdAt &&
        distance == other.distance;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, collectionDayOfWeek.hashCode);
    _$hash = $jc(_$hash, collectionStartDate.hashCode);
    _$hash = $jc(_$hash, farmType.hashCode);
    _$hash = $jc(_$hash, siteSubType.hashCode);
    _$hash = $jc(_$hash, siteType.hashCode);
    _$hash = $jc(_$hash, diseases.hashCode);
    _$hash = $jc(_$hash, collectionCollector.hashCode);
    _$hash = $jc(_$hash, createdBy.hashCode);
    _$hash = $jc(_$hash, location.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, siteCode.hashCode);
    _$hash = $jc(_$hash, collectionConsent.hashCode);
    _$hash = $jc(_$hash, collectionFrequencyInterval.hashCode);
    _$hash = $jc(_$hash, collectionFrequency.hashCode);
    _$hash = $jc(_$hash, collectionTime.hashCode);
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
    _$hash = $jc(_$hash, distance.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'NearbySiteResponseData')
          ..add('collectionDayOfWeek', collectionDayOfWeek)
          ..add('collectionStartDate', collectionStartDate)
          ..add('farmType', farmType)
          ..add('siteSubType', siteSubType)
          ..add('siteType', siteType)
          ..add('diseases', diseases)
          ..add('collectionCollector', collectionCollector)
          ..add('createdBy', createdBy)
          ..add('location', location)
          ..add('id', id)
          ..add('name', name)
          ..add('siteCode', siteCode)
          ..add('collectionConsent', collectionConsent)
          ..add('collectionFrequencyInterval', collectionFrequencyInterval)
          ..add('collectionFrequency', collectionFrequency)
          ..add('collectionTime', collectionTime)
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
          ..add('createdAt', createdAt)
          ..add('distance', distance))
        .toString();
  }
}

class NearbySiteResponseDataBuilder
    implements Builder<NearbySiteResponseData, NearbySiteResponseDataBuilder> {
  _$NearbySiteResponseData? _$v;

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

  String? _siteSubType;
  String? get siteSubType => _$this._siteSubType;
  set siteSubType(String? siteSubType) => _$this._siteSubType = siteSubType;

  SiteType? _siteType;
  SiteType? get siteType => _$this._siteType;
  set siteType(SiteType? siteType) => _$this._siteType = siteType;

  ListBuilder<Disease>? _diseases;
  ListBuilder<Disease> get diseases =>
      _$this._diseases ??= ListBuilder<Disease>();
  set diseases(ListBuilder<Disease>? diseases) => _$this._diseases = diseases;

  UserBuilder? _collectionCollector;
  UserBuilder get collectionCollector =>
      _$this._collectionCollector ??= UserBuilder();
  set collectionCollector(UserBuilder? collectionCollector) =>
      _$this._collectionCollector = collectionCollector;

  UserWithTeamResponseBuilder? _createdBy;
  UserWithTeamResponseBuilder get createdBy =>
      _$this._createdBy ??= UserWithTeamResponseBuilder();
  set createdBy(UserWithTeamResponseBuilder? createdBy) =>
      _$this._createdBy = createdBy;

  LocationBuilder? _location;
  LocationBuilder get location => _$this._location ??= LocationBuilder();
  set location(LocationBuilder? location) => _$this._location = location;

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

  num? _distance;
  num? get distance => _$this._distance;
  set distance(num? distance) => _$this._distance = distance;

  NearbySiteResponseDataBuilder() {
    NearbySiteResponseData._defaults(this);
  }

  NearbySiteResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _collectionDayOfWeek = $v.collectionDayOfWeek?.toBuilder();
      _collectionStartDate = $v.collectionStartDate;
      _farmType = $v.farmType;
      _siteSubType = $v.siteSubType;
      _siteType = $v.siteType;
      _diseases = $v.diseases.toBuilder();
      _collectionCollector = $v.collectionCollector?.toBuilder();
      _createdBy = $v.createdBy?.toBuilder();
      _location = $v.location?.toBuilder();
      _id = $v.id;
      _name = $v.name;
      _siteCode = $v.siteCode;
      _collectionConsent = $v.collectionConsent;
      _collectionFrequencyInterval = $v.collectionFrequencyInterval;
      _collectionFrequency = $v.collectionFrequency;
      _collectionTime = $v.collectionTime;
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
      _distance = $v.distance;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(NearbySiteResponseData other) {
    _$v = other as _$NearbySiteResponseData;
  }

  @override
  void update(void Function(NearbySiteResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  NearbySiteResponseData build() => _build();

  _$NearbySiteResponseData _build() {
    _$NearbySiteResponseData _$result;
    try {
      _$result = _$v ??
          _$NearbySiteResponseData._(
            collectionDayOfWeek: _collectionDayOfWeek?.build(),
            collectionStartDate: collectionStartDate,
            farmType: farmType,
            siteSubType: siteSubType,
            siteType: siteType,
            diseases: diseases.build(),
            collectionCollector: _collectionCollector?.build(),
            createdBy: _createdBy?.build(),
            location: _location?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'NearbySiteResponseData', 'id'),
            name: BuiltValueNullFieldError.checkNotNull(
                name, r'NearbySiteResponseData', 'name'),
            siteCode: siteCode,
            collectionConsent: collectionConsent,
            collectionFrequencyInterval: collectionFrequencyInterval,
            collectionFrequency: collectionFrequency,
            collectionTime: collectionTime,
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
                createdAt, r'NearbySiteResponseData', 'createdAt'),
            distance: BuiltValueNullFieldError.checkNotNull(
                distance, r'NearbySiteResponseData', 'distance'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'collectionDayOfWeek';
        _collectionDayOfWeek?.build();

        _$failedField = 'diseases';
        diseases.build();
        _$failedField = 'collectionCollector';
        _collectionCollector?.build();
        _$failedField = 'createdBy';
        _createdBy?.build();
        _$failedField = 'location';
        _location?.build();

        _$failedField = 'photos';
        _photos?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'NearbySiteResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
