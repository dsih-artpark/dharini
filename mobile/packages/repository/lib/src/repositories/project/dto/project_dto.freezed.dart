// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'project_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ProjectDto _$ProjectDtoFromJson(Map<String, dynamic> json) {
  return _ProjectDto.fromJson(json);
}

/// @nodoc
mixin _$ProjectDto {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get code => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  List<String>? get projectAdminIds => throw _privateConstructorUsedError;
  List<String>? get diseaseIds => throw _privateConstructorUsedError;
  List<String>? get surveillanceTypeIds => throw _privateConstructorUsedError;
  List<String>? get locationIds => throw _privateConstructorUsedError;
  List<String>? get logisticDetails => throw _privateConstructorUsedError;
  String? get processDetail => throw _privateConstructorUsedError;
  List<String>? get siteIds => throw _privateConstructorUsedError;
  List<String>? get memberIds => throw _privateConstructorUsedError;
  List<String>? get visitIds => throw _privateConstructorUsedError;
  bool get isOnboardingCompleted => throw _privateConstructorUsedError;
  String? get status => throw _privateConstructorUsedError;
  String? get createdById => throw _privateConstructorUsedError;
  String? get updatedById => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ProjectDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProjectDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectDtoCopyWith<ProjectDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectDtoCopyWith<$Res> {
  factory $ProjectDtoCopyWith(
          ProjectDto value, $Res Function(ProjectDto) then) =
      _$ProjectDtoCopyWithImpl<$Res, ProjectDto>;
  @useResult
  $Res call(
      {String id,
      String name,
      String code,
      String email,
      List<String>? projectAdminIds,
      List<String>? diseaseIds,
      List<String>? surveillanceTypeIds,
      List<String>? locationIds,
      List<String>? logisticDetails,
      String? processDetail,
      List<String>? siteIds,
      List<String>? memberIds,
      List<String>? visitIds,
      bool isOnboardingCompleted,
      String? status,
      String? createdById,
      String? updatedById,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class _$ProjectDtoCopyWithImpl<$Res, $Val extends ProjectDto>
    implements $ProjectDtoCopyWith<$Res> {
  _$ProjectDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProjectDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? code = null,
    Object? email = null,
    Object? projectAdminIds = freezed,
    Object? diseaseIds = freezed,
    Object? surveillanceTypeIds = freezed,
    Object? locationIds = freezed,
    Object? logisticDetails = freezed,
    Object? processDetail = freezed,
    Object? siteIds = freezed,
    Object? memberIds = freezed,
    Object? visitIds = freezed,
    Object? isOnboardingCompleted = null,
    Object? status = freezed,
    Object? createdById = freezed,
    Object? updatedById = freezed,
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
      code: null == code
          ? _value.code
          : code // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      projectAdminIds: freezed == projectAdminIds
          ? _value.projectAdminIds
          : projectAdminIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      diseaseIds: freezed == diseaseIds
          ? _value.diseaseIds
          : diseaseIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      surveillanceTypeIds: freezed == surveillanceTypeIds
          ? _value.surveillanceTypeIds
          : surveillanceTypeIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      locationIds: freezed == locationIds
          ? _value.locationIds
          : locationIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      logisticDetails: freezed == logisticDetails
          ? _value.logisticDetails
          : logisticDetails // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      processDetail: freezed == processDetail
          ? _value.processDetail
          : processDetail // ignore: cast_nullable_to_non_nullable
              as String?,
      siteIds: freezed == siteIds
          ? _value.siteIds
          : siteIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      memberIds: freezed == memberIds
          ? _value.memberIds
          : memberIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value.visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      isOnboardingCompleted: null == isOnboardingCompleted
          ? _value.isOnboardingCompleted
          : isOnboardingCompleted // ignore: cast_nullable_to_non_nullable
              as bool,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      createdById: freezed == createdById
          ? _value.createdById
          : createdById // ignore: cast_nullable_to_non_nullable
              as String?,
      updatedById: freezed == updatedById
          ? _value.updatedById
          : updatedById // ignore: cast_nullable_to_non_nullable
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
abstract class _$$ProjectDtoImplCopyWith<$Res>
    implements $ProjectDtoCopyWith<$Res> {
  factory _$$ProjectDtoImplCopyWith(
          _$ProjectDtoImpl value, $Res Function(_$ProjectDtoImpl) then) =
      __$$ProjectDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String code,
      String email,
      List<String>? projectAdminIds,
      List<String>? diseaseIds,
      List<String>? surveillanceTypeIds,
      List<String>? locationIds,
      List<String>? logisticDetails,
      String? processDetail,
      List<String>? siteIds,
      List<String>? memberIds,
      List<String>? visitIds,
      bool isOnboardingCompleted,
      String? status,
      String? createdById,
      String? updatedById,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class __$$ProjectDtoImplCopyWithImpl<$Res>
    extends _$ProjectDtoCopyWithImpl<$Res, _$ProjectDtoImpl>
    implements _$$ProjectDtoImplCopyWith<$Res> {
  __$$ProjectDtoImplCopyWithImpl(
      _$ProjectDtoImpl _value, $Res Function(_$ProjectDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of ProjectDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? code = null,
    Object? email = null,
    Object? projectAdminIds = freezed,
    Object? diseaseIds = freezed,
    Object? surveillanceTypeIds = freezed,
    Object? locationIds = freezed,
    Object? logisticDetails = freezed,
    Object? processDetail = freezed,
    Object? siteIds = freezed,
    Object? memberIds = freezed,
    Object? visitIds = freezed,
    Object? isOnboardingCompleted = null,
    Object? status = freezed,
    Object? createdById = freezed,
    Object? updatedById = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_$ProjectDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      code: null == code
          ? _value.code
          : code // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      projectAdminIds: freezed == projectAdminIds
          ? _value._projectAdminIds
          : projectAdminIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      diseaseIds: freezed == diseaseIds
          ? _value._diseaseIds
          : diseaseIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      surveillanceTypeIds: freezed == surveillanceTypeIds
          ? _value._surveillanceTypeIds
          : surveillanceTypeIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      locationIds: freezed == locationIds
          ? _value._locationIds
          : locationIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      logisticDetails: freezed == logisticDetails
          ? _value._logisticDetails
          : logisticDetails // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      processDetail: freezed == processDetail
          ? _value.processDetail
          : processDetail // ignore: cast_nullable_to_non_nullable
              as String?,
      siteIds: freezed == siteIds
          ? _value._siteIds
          : siteIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      memberIds: freezed == memberIds
          ? _value._memberIds
          : memberIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value._visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      isOnboardingCompleted: null == isOnboardingCompleted
          ? _value.isOnboardingCompleted
          : isOnboardingCompleted // ignore: cast_nullable_to_non_nullable
              as bool,
      status: freezed == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String?,
      createdById: freezed == createdById
          ? _value.createdById
          : createdById // ignore: cast_nullable_to_non_nullable
              as String?,
      updatedById: freezed == updatedById
          ? _value.updatedById
          : updatedById // ignore: cast_nullable_to_non_nullable
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
class _$ProjectDtoImpl implements _ProjectDto {
  const _$ProjectDtoImpl(
      {required this.id,
      required this.name,
      required this.code,
      required this.email,
      final List<String>? projectAdminIds,
      final List<String>? diseaseIds,
      final List<String>? surveillanceTypeIds,
      final List<String>? locationIds,
      final List<String>? logisticDetails,
      this.processDetail,
      final List<String>? siteIds,
      final List<String>? memberIds,
      final List<String>? visitIds,
      this.isOnboardingCompleted = false,
      this.status,
      this.createdById,
      this.updatedById,
      this.createdAt,
      this.updatedAt})
      : _projectAdminIds = projectAdminIds,
        _diseaseIds = diseaseIds,
        _surveillanceTypeIds = surveillanceTypeIds,
        _locationIds = locationIds,
        _logisticDetails = logisticDetails,
        _siteIds = siteIds,
        _memberIds = memberIds,
        _visitIds = visitIds;

  factory _$ProjectDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String code;
  @override
  final String email;
  final List<String>? _projectAdminIds;
  @override
  List<String>? get projectAdminIds {
    final value = _projectAdminIds;
    if (value == null) return null;
    if (_projectAdminIds is EqualUnmodifiableListView) return _projectAdminIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _diseaseIds;
  @override
  List<String>? get diseaseIds {
    final value = _diseaseIds;
    if (value == null) return null;
    if (_diseaseIds is EqualUnmodifiableListView) return _diseaseIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _surveillanceTypeIds;
  @override
  List<String>? get surveillanceTypeIds {
    final value = _surveillanceTypeIds;
    if (value == null) return null;
    if (_surveillanceTypeIds is EqualUnmodifiableListView)
      return _surveillanceTypeIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _locationIds;
  @override
  List<String>? get locationIds {
    final value = _locationIds;
    if (value == null) return null;
    if (_locationIds is EqualUnmodifiableListView) return _locationIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _logisticDetails;
  @override
  List<String>? get logisticDetails {
    final value = _logisticDetails;
    if (value == null) return null;
    if (_logisticDetails is EqualUnmodifiableListView) return _logisticDetails;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? processDetail;
  final List<String>? _siteIds;
  @override
  List<String>? get siteIds {
    final value = _siteIds;
    if (value == null) return null;
    if (_siteIds is EqualUnmodifiableListView) return _siteIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _memberIds;
  @override
  List<String>? get memberIds {
    final value = _memberIds;
    if (value == null) return null;
    if (_memberIds is EqualUnmodifiableListView) return _memberIds;
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

  @override
  @JsonKey()
  final bool isOnboardingCompleted;
  @override
  final String? status;
  @override
  final String? createdById;
  @override
  final String? updatedById;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'ProjectDto(id: $id, name: $name, code: $code, email: $email, projectAdminIds: $projectAdminIds, diseaseIds: $diseaseIds, surveillanceTypeIds: $surveillanceTypeIds, locationIds: $locationIds, logisticDetails: $logisticDetails, processDetail: $processDetail, siteIds: $siteIds, memberIds: $memberIds, visitIds: $visitIds, isOnboardingCompleted: $isOnboardingCompleted, status: $status, createdById: $createdById, updatedById: $updatedById, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.code, code) || other.code == code) &&
            (identical(other.email, email) || other.email == email) &&
            const DeepCollectionEquality()
                .equals(other._projectAdminIds, _projectAdminIds) &&
            const DeepCollectionEquality()
                .equals(other._diseaseIds, _diseaseIds) &&
            const DeepCollectionEquality()
                .equals(other._surveillanceTypeIds, _surveillanceTypeIds) &&
            const DeepCollectionEquality()
                .equals(other._locationIds, _locationIds) &&
            const DeepCollectionEquality()
                .equals(other._logisticDetails, _logisticDetails) &&
            (identical(other.processDetail, processDetail) ||
                other.processDetail == processDetail) &&
            const DeepCollectionEquality().equals(other._siteIds, _siteIds) &&
            const DeepCollectionEquality()
                .equals(other._memberIds, _memberIds) &&
            const DeepCollectionEquality().equals(other._visitIds, _visitIds) &&
            (identical(other.isOnboardingCompleted, isOnboardingCompleted) ||
                other.isOnboardingCompleted == isOnboardingCompleted) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdById, createdById) ||
                other.createdById == createdById) &&
            (identical(other.updatedById, updatedById) ||
                other.updatedById == updatedById) &&
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
        code,
        email,
        const DeepCollectionEquality().hash(_projectAdminIds),
        const DeepCollectionEquality().hash(_diseaseIds),
        const DeepCollectionEquality().hash(_surveillanceTypeIds),
        const DeepCollectionEquality().hash(_locationIds),
        const DeepCollectionEquality().hash(_logisticDetails),
        processDetail,
        const DeepCollectionEquality().hash(_siteIds),
        const DeepCollectionEquality().hash(_memberIds),
        const DeepCollectionEquality().hash(_visitIds),
        isOnboardingCompleted,
        status,
        createdById,
        updatedById,
        createdAt,
        updatedAt
      ]);

  /// Create a copy of ProjectDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectDtoImplCopyWith<_$ProjectDtoImpl> get copyWith =>
      __$$ProjectDtoImplCopyWithImpl<_$ProjectDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectDtoImplToJson(
      this,
    );
  }
}

abstract class _ProjectDto implements ProjectDto {
  const factory _ProjectDto(
      {required final String id,
      required final String name,
      required final String code,
      required final String email,
      final List<String>? projectAdminIds,
      final List<String>? diseaseIds,
      final List<String>? surveillanceTypeIds,
      final List<String>? locationIds,
      final List<String>? logisticDetails,
      final String? processDetail,
      final List<String>? siteIds,
      final List<String>? memberIds,
      final List<String>? visitIds,
      final bool isOnboardingCompleted,
      final String? status,
      final String? createdById,
      final String? updatedById,
      final DateTime? createdAt,
      final DateTime? updatedAt}) = _$ProjectDtoImpl;

  factory _ProjectDto.fromJson(Map<String, dynamic> json) =
      _$ProjectDtoImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get code;
  @override
  String get email;
  @override
  List<String>? get projectAdminIds;
  @override
  List<String>? get diseaseIds;
  @override
  List<String>? get surveillanceTypeIds;
  @override
  List<String>? get locationIds;
  @override
  List<String>? get logisticDetails;
  @override
  String? get processDetail;
  @override
  List<String>? get siteIds;
  @override
  List<String>? get memberIds;
  @override
  List<String>? get visitIds;
  @override
  bool get isOnboardingCompleted;
  @override
  String? get status;
  @override
  String? get createdById;
  @override
  String? get updatedById;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of ProjectDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectDtoImplCopyWith<_$ProjectDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
