// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'site_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

SiteDto _$SiteDtoFromJson(Map<String, dynamic> json) {
  return _SiteDto.fromJson(json);
}

/// @nodoc
mixin _$SiteDto {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get projectId => throw _privateConstructorUsedError;
  String? get diseaseId => throw _privateConstructorUsedError;
  int? get collectionFrequencyInterval => throw _privateConstructorUsedError;
  int? get collectionFrequency => throw _privateConstructorUsedError;
  List<String>? get collectionDayOfWeek => throw _privateConstructorUsedError;
  String? get collectionTime => throw _privateConstructorUsedError;
  DateTime? get collectionStartDate => throw _privateConstructorUsedError;
  DateTime? get collectionLastScheduleDate =>
      throw _privateConstructorUsedError;
  int? get collectionDuration => throw _privateConstructorUsedError;
  List<String>? get collectionCollectorIds =>
      throw _privateConstructorUsedError;
  DateTime? get collectionExpiryDate => throw _privateConstructorUsedError;
  List<String>? get photos => throw _privateConstructorUsedError;
  List<String>? get visitIds => throw _privateConstructorUsedError;
  List<String>? get sampleIds => throw _privateConstructorUsedError;
  String? get farmType => throw _privateConstructorUsedError;
  String? get siteType => throw _privateConstructorUsedError;
  String? get siteOwnerName => throw _privateConstructorUsedError;
  String? get siteOwnerNumber => throw _privateConstructorUsedError;
  int? get workerNumber => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String? get district => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  int? get pinCode => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  String? get comment => throw _privateConstructorUsedError;
  String? get status => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this SiteDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SiteDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SiteDtoCopyWith<SiteDto> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SiteDtoCopyWith<$Res> {
  factory $SiteDtoCopyWith(SiteDto value, $Res Function(SiteDto) then) =
      _$SiteDtoCopyWithImpl<$Res, SiteDto>;
  @useResult
  $Res call(
      {String id,
      String name,
      String? projectId,
      String? diseaseId,
      int? collectionFrequencyInterval,
      int? collectionFrequency,
      List<String>? collectionDayOfWeek,
      String? collectionTime,
      DateTime? collectionStartDate,
      DateTime? collectionLastScheduleDate,
      int? collectionDuration,
      List<String>? collectionCollectorIds,
      DateTime? collectionExpiryDate,
      List<String>? photos,
      List<String>? visitIds,
      List<String>? sampleIds,
      String? farmType,
      String? siteType,
      String? siteOwnerName,
      String? siteOwnerNumber,
      int? workerNumber,
      String? address,
      String? district,
      String? state,
      int? pinCode,
      double? latitude,
      double? longitude,
      String? comment,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class _$SiteDtoCopyWithImpl<$Res, $Val extends SiteDto>
    implements $SiteDtoCopyWith<$Res> {
  _$SiteDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SiteDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? projectId = freezed,
    Object? diseaseId = freezed,
    Object? collectionFrequencyInterval = freezed,
    Object? collectionFrequency = freezed,
    Object? collectionDayOfWeek = freezed,
    Object? collectionTime = freezed,
    Object? collectionStartDate = freezed,
    Object? collectionLastScheduleDate = freezed,
    Object? collectionDuration = freezed,
    Object? collectionCollectorIds = freezed,
    Object? collectionExpiryDate = freezed,
    Object? photos = freezed,
    Object? visitIds = freezed,
    Object? sampleIds = freezed,
    Object? farmType = freezed,
    Object? siteType = freezed,
    Object? siteOwnerName = freezed,
    Object? siteOwnerNumber = freezed,
    Object? workerNumber = freezed,
    Object? address = freezed,
    Object? district = freezed,
    Object? state = freezed,
    Object? pinCode = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? comment = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      diseaseId: freezed == diseaseId
          ? _value.diseaseId
          : diseaseId // ignore: cast_nullable_to_non_nullable
              as String?,
      collectionFrequencyInterval: freezed == collectionFrequencyInterval
          ? _value.collectionFrequencyInterval
          : collectionFrequencyInterval // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionFrequency: freezed == collectionFrequency
          ? _value.collectionFrequency
          : collectionFrequency // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionDayOfWeek: freezed == collectionDayOfWeek
          ? _value.collectionDayOfWeek
          : collectionDayOfWeek // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      collectionTime: freezed == collectionTime
          ? _value.collectionTime
          : collectionTime // ignore: cast_nullable_to_non_nullable
              as String?,
      collectionStartDate: freezed == collectionStartDate
          ? _value.collectionStartDate
          : collectionStartDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      collectionLastScheduleDate: freezed == collectionLastScheduleDate
          ? _value.collectionLastScheduleDate
          : collectionLastScheduleDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      collectionDuration: freezed == collectionDuration
          ? _value.collectionDuration
          : collectionDuration // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionCollectorIds: freezed == collectionCollectorIds
          ? _value.collectionCollectorIds
          : collectionCollectorIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      collectionExpiryDate: freezed == collectionExpiryDate
          ? _value.collectionExpiryDate
          : collectionExpiryDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      photos: freezed == photos
          ? _value.photos
          : photos // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value.visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      sampleIds: freezed == sampleIds
          ? _value.sampleIds
          : sampleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      farmType: freezed == farmType
          ? _value.farmType
          : farmType // ignore: cast_nullable_to_non_nullable
              as String?,
      siteType: freezed == siteType
          ? _value.siteType
          : siteType // ignore: cast_nullable_to_non_nullable
              as String?,
      siteOwnerName: freezed == siteOwnerName
          ? _value.siteOwnerName
          : siteOwnerName // ignore: cast_nullable_to_non_nullable
              as String?,
      siteOwnerNumber: freezed == siteOwnerNumber
          ? _value.siteOwnerNumber
          : siteOwnerNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      workerNumber: freezed == workerNumber
          ? _value.workerNumber
          : workerNumber // ignore: cast_nullable_to_non_nullable
              as int?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      district: freezed == district
          ? _value.district
          : district // ignore: cast_nullable_to_non_nullable
              as String?,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      pinCode: freezed == pinCode
          ? _value.pinCode
          : pinCode // ignore: cast_nullable_to_non_nullable
              as int?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      comment: freezed == comment
          ? _value.comment
          : comment // ignore: cast_nullable_to_non_nullable
              as String?,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SiteDtoImplCopyWith<$Res> implements $SiteDtoCopyWith<$Res> {
  factory _$$SiteDtoImplCopyWith(
          _$SiteDtoImpl value, $Res Function(_$SiteDtoImpl) then) =
      __$$SiteDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String? projectId,
      String? diseaseId,
      int? collectionFrequencyInterval,
      int? collectionFrequency,
      List<String>? collectionDayOfWeek,
      String? collectionTime,
      DateTime? collectionStartDate,
      DateTime? collectionLastScheduleDate,
      int? collectionDuration,
      List<String>? collectionCollectorIds,
      DateTime? collectionExpiryDate,
      List<String>? photos,
      List<String>? visitIds,
      List<String>? sampleIds,
      String? farmType,
      String? siteType,
      String? siteOwnerName,
      String? siteOwnerNumber,
      int? workerNumber,
      String? address,
      String? district,
      String? state,
      int? pinCode,
      double? latitude,
      double? longitude,
      String? comment,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class __$$SiteDtoImplCopyWithImpl<$Res>
    extends _$SiteDtoCopyWithImpl<$Res, _$SiteDtoImpl>
    implements _$$SiteDtoImplCopyWith<$Res> {
  __$$SiteDtoImplCopyWithImpl(
      _$SiteDtoImpl _value, $Res Function(_$SiteDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of SiteDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? projectId = freezed,
    Object? diseaseId = freezed,
    Object? collectionFrequencyInterval = freezed,
    Object? collectionFrequency = freezed,
    Object? collectionDayOfWeek = freezed,
    Object? collectionTime = freezed,
    Object? collectionStartDate = freezed,
    Object? collectionLastScheduleDate = freezed,
    Object? collectionDuration = freezed,
    Object? collectionCollectorIds = freezed,
    Object? collectionExpiryDate = freezed,
    Object? photos = freezed,
    Object? visitIds = freezed,
    Object? sampleIds = freezed,
    Object? farmType = freezed,
    Object? siteType = freezed,
    Object? siteOwnerName = freezed,
    Object? siteOwnerNumber = freezed,
    Object? workerNumber = freezed,
    Object? address = freezed,
    Object? district = freezed,
    Object? state = freezed,
    Object? pinCode = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? comment = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_$SiteDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      diseaseId: freezed == diseaseId
          ? _value.diseaseId
          : diseaseId // ignore: cast_nullable_to_non_nullable
              as String?,
      collectionFrequencyInterval: freezed == collectionFrequencyInterval
          ? _value.collectionFrequencyInterval
          : collectionFrequencyInterval // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionFrequency: freezed == collectionFrequency
          ? _value.collectionFrequency
          : collectionFrequency // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionDayOfWeek: freezed == collectionDayOfWeek
          ? _value._collectionDayOfWeek
          : collectionDayOfWeek // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      collectionTime: freezed == collectionTime
          ? _value.collectionTime
          : collectionTime // ignore: cast_nullable_to_non_nullable
              as String?,
      collectionStartDate: freezed == collectionStartDate
          ? _value.collectionStartDate
          : collectionStartDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      collectionLastScheduleDate: freezed == collectionLastScheduleDate
          ? _value.collectionLastScheduleDate
          : collectionLastScheduleDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      collectionDuration: freezed == collectionDuration
          ? _value.collectionDuration
          : collectionDuration // ignore: cast_nullable_to_non_nullable
              as int?,
      collectionCollectorIds: freezed == collectionCollectorIds
          ? _value._collectionCollectorIds
          : collectionCollectorIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      collectionExpiryDate: freezed == collectionExpiryDate
          ? _value.collectionExpiryDate
          : collectionExpiryDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      photos: freezed == photos
          ? _value._photos
          : photos // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value._visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      sampleIds: freezed == sampleIds
          ? _value._sampleIds
          : sampleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      farmType: freezed == farmType
          ? _value.farmType
          : farmType // ignore: cast_nullable_to_non_nullable
              as String?,
      siteType: freezed == siteType
          ? _value.siteType
          : siteType // ignore: cast_nullable_to_non_nullable
              as String?,
      siteOwnerName: freezed == siteOwnerName
          ? _value.siteOwnerName
          : siteOwnerName // ignore: cast_nullable_to_non_nullable
              as String?,
      siteOwnerNumber: freezed == siteOwnerNumber
          ? _value.siteOwnerNumber
          : siteOwnerNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      workerNumber: freezed == workerNumber
          ? _value.workerNumber
          : workerNumber // ignore: cast_nullable_to_non_nullable
              as int?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      district: freezed == district
          ? _value.district
          : district // ignore: cast_nullable_to_non_nullable
              as String?,
      state: freezed == state
          ? _value.state
          : state // ignore: cast_nullable_to_non_nullable
              as String?,
      pinCode: freezed == pinCode
          ? _value.pinCode
          : pinCode // ignore: cast_nullable_to_non_nullable
              as int?,
      latitude: freezed == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double?,
      longitude: freezed == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double?,
      comment: freezed == comment
          ? _value.comment
          : comment // ignore: cast_nullable_to_non_nullable
              as String?,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SiteDtoImpl implements _SiteDto {
  const _$SiteDtoImpl(
      {required this.id,
      required this.name,
      this.projectId,
      this.diseaseId,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      final List<String>? collectionDayOfWeek,
      this.collectionTime,
      this.collectionStartDate,
      this.collectionLastScheduleDate,
      this.collectionDuration,
      final List<String>? collectionCollectorIds,
      this.collectionExpiryDate,
      final List<String>? photos,
      final List<String>? visitIds,
      final List<String>? sampleIds,
      this.farmType,
      this.siteType,
      this.siteOwnerName,
      this.siteOwnerNumber,
      this.workerNumber,
      this.address,
      this.district,
      this.state,
      this.pinCode,
      this.latitude,
      this.longitude,
      this.comment,
      this.status,
      this.createdAt,
      this.updatedAt})
      : _collectionDayOfWeek = collectionDayOfWeek,
        _collectionCollectorIds = collectionCollectorIds,
        _photos = photos,
        _visitIds = visitIds,
        _sampleIds = sampleIds;

  factory _$SiteDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$SiteDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? projectId;
  @override
  final String? diseaseId;
  @override
  final int? collectionFrequencyInterval;
  @override
  final int? collectionFrequency;
  final List<String>? _collectionDayOfWeek;
  @override
  List<String>? get collectionDayOfWeek {
    final value = _collectionDayOfWeek;
    if (value == null) return null;
    if (_collectionDayOfWeek is EqualUnmodifiableListView)
      return _collectionDayOfWeek;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? collectionTime;
  @override
  final DateTime? collectionStartDate;
  @override
  final DateTime? collectionLastScheduleDate;
  @override
  final int? collectionDuration;
  final List<String>? _collectionCollectorIds;
  @override
  List<String>? get collectionCollectorIds {
    final value = _collectionCollectorIds;
    if (value == null) return null;
    if (_collectionCollectorIds is EqualUnmodifiableListView)
      return _collectionCollectorIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final DateTime? collectionExpiryDate;
  final List<String>? _photos;
  @override
  List<String>? get photos {
    final value = _photos;
    if (value == null) return null;
    if (_photos is EqualUnmodifiableListView) return _photos;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _visitIds;
  @override
  List<String>? get visitIds {
    final value = _visitIds;
    if (value == null) return null;
    if (_visitIds is EqualUnmodifiableListView) return _visitIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _sampleIds;
  @override
  List<String>? get sampleIds {
    final value = _sampleIds;
    if (value == null) return null;
    if (_sampleIds is EqualUnmodifiableListView) return _sampleIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? farmType;
  @override
  final String? siteType;
  @override
  final String? siteOwnerName;
  @override
  final String? siteOwnerNumber;
  @override
  final int? workerNumber;
  @override
  final String? address;
  @override
  final String? district;
  @override
  final String? state;
  @override
  final int? pinCode;
  @override
  final double? latitude;
  @override
  final double? longitude;
  @override
  final String? comment;
  @override
  final String? status;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'SiteDto(id: $id, name: $name, projectId: $projectId, diseaseId: $diseaseId, collectionFrequencyInterval: $collectionFrequencyInterval, collectionFrequency: $collectionFrequency, collectionDayOfWeek: $collectionDayOfWeek, collectionTime: $collectionTime, collectionStartDate: $collectionStartDate, collectionLastScheduleDate: $collectionLastScheduleDate, collectionDuration: $collectionDuration, collectionCollectorIds: $collectionCollectorIds, collectionExpiryDate: $collectionExpiryDate, photos: $photos, visitIds: $visitIds, sampleIds: $sampleIds, farmType: $farmType, siteType: $siteType, siteOwnerName: $siteOwnerName, siteOwnerNumber: $siteOwnerNumber, workerNumber: $workerNumber, address: $address, district: $district, state: $state, pinCode: $pinCode, latitude: $latitude, longitude: $longitude, comment: $comment, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SiteDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            (identical(other.diseaseId, diseaseId) ||
                other.diseaseId == diseaseId) &&
            (identical(other.collectionFrequencyInterval,
                    collectionFrequencyInterval) ||
                other.collectionFrequencyInterval ==
                    collectionFrequencyInterval) &&
            (identical(other.collectionFrequency, collectionFrequency) ||
                other.collectionFrequency == collectionFrequency) &&
            const DeepCollectionEquality()
                .equals(other._collectionDayOfWeek, _collectionDayOfWeek) &&
            (identical(other.collectionTime, collectionTime) ||
                other.collectionTime == collectionTime) &&
            (identical(other.collectionStartDate, collectionStartDate) ||
                other.collectionStartDate == collectionStartDate) &&
            (identical(other.collectionLastScheduleDate,
                    collectionLastScheduleDate) ||
                other.collectionLastScheduleDate ==
                    collectionLastScheduleDate) &&
            (identical(other.collectionDuration, collectionDuration) ||
                other.collectionDuration == collectionDuration) &&
            const DeepCollectionEquality().equals(
                other._collectionCollectorIds, _collectionCollectorIds) &&
            (identical(other.collectionExpiryDate, collectionExpiryDate) ||
                other.collectionExpiryDate == collectionExpiryDate) &&
            const DeepCollectionEquality().equals(other._photos, _photos) &&
            const DeepCollectionEquality().equals(other._visitIds, _visitIds) &&
            const DeepCollectionEquality()
                .equals(other._sampleIds, _sampleIds) &&
            (identical(other.farmType, farmType) ||
                other.farmType == farmType) &&
            (identical(other.siteType, siteType) ||
                other.siteType == siteType) &&
            (identical(other.siteOwnerName, siteOwnerName) ||
                other.siteOwnerName == siteOwnerName) &&
            (identical(other.siteOwnerNumber, siteOwnerNumber) ||
                other.siteOwnerNumber == siteOwnerNumber) &&
            (identical(other.workerNumber, workerNumber) ||
                other.workerNumber == workerNumber) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.district, district) ||
                other.district == district) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.pinCode, pinCode) || other.pinCode == pinCode) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.comment, comment) || other.comment == comment) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        name,
        projectId,
        diseaseId,
        collectionFrequencyInterval,
        collectionFrequency,
        const DeepCollectionEquality().hash(_collectionDayOfWeek),
        collectionTime,
        collectionStartDate,
        collectionLastScheduleDate,
        collectionDuration,
        const DeepCollectionEquality().hash(_collectionCollectorIds),
        collectionExpiryDate,
        const DeepCollectionEquality().hash(_photos),
        const DeepCollectionEquality().hash(_visitIds),
        const DeepCollectionEquality().hash(_sampleIds),
        farmType,
        siteType,
        siteOwnerName,
        siteOwnerNumber,
        workerNumber,
        address,
        district,
        state,
        pinCode,
        latitude,
        longitude,
        comment,
        status,
        createdAt,
        updatedAt
      ]);

  /// Create a copy of SiteDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SiteDtoImplCopyWith<_$SiteDtoImpl> get copyWith =>
      __$$SiteDtoImplCopyWithImpl<_$SiteDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SiteDtoImplToJson(
      this,
    );
  }
}

abstract class _SiteDto implements SiteDto {
  const factory _SiteDto(
      {required final String id,
      required final String name,
      final String? projectId,
      final String? diseaseId,
      final int? collectionFrequencyInterval,
      final int? collectionFrequency,
      final List<String>? collectionDayOfWeek,
      final String? collectionTime,
      final DateTime? collectionStartDate,
      final DateTime? collectionLastScheduleDate,
      final int? collectionDuration,
      final List<String>? collectionCollectorIds,
      final DateTime? collectionExpiryDate,
      final List<String>? photos,
      final List<String>? visitIds,
      final List<String>? sampleIds,
      final String? farmType,
      final String? siteType,
      final String? siteOwnerName,
      final String? siteOwnerNumber,
      final int? workerNumber,
      final String? address,
      final String? district,
      final String? state,
      final int? pinCode,
      final double? latitude,
      final double? longitude,
      final String? comment,
      final String? status,
      final DateTime? createdAt,
      final DateTime? updatedAt}) = _$SiteDtoImpl;

  factory _SiteDto.fromJson(Map<String, dynamic> json) = _$SiteDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get projectId;
  @override
  String? get diseaseId;
  @override
  int? get collectionFrequencyInterval;
  @override
  int? get collectionFrequency;
  @override
  List<String>? get collectionDayOfWeek;
  @override
  String? get collectionTime;
  @override
  DateTime? get collectionStartDate;
  @override
  DateTime? get collectionLastScheduleDate;
  @override
  int? get collectionDuration;
  @override
  List<String>? get collectionCollectorIds;
  @override
  DateTime? get collectionExpiryDate;
  @override
  List<String>? get photos;
  @override
  List<String>? get visitIds;
  @override
  List<String>? get sampleIds;
  @override
  String? get farmType;
  @override
  String? get siteType;
  @override
  String? get siteOwnerName;
  @override
  String? get siteOwnerNumber;
  @override
  int? get workerNumber;
  @override
  String? get address;
  @override
  String? get district;
  @override
  String? get state;
  @override
  int? get pinCode;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  String? get comment;
  @override
  String? get status;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of SiteDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SiteDtoImplCopyWith<_$SiteDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
