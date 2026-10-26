// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

UserDto _$UserDtoFromJson(Map<String, dynamic> json) {
  return _UserDto.fromJson(json);
}

/// @nodoc
mixin _$UserDto {
  String get id => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get designation => throw _privateConstructorUsedError;
  String? get contactNumber => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String? get email => throw _privateConstructorUsedError;
  String? get otp => throw _privateConstructorUsedError;
  String? get userType => throw _privateConstructorUsedError;
  String? get status => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;
  List<String>? get roleIds => throw _privateConstructorUsedError;
  List<String>? get visitIds => throw _privateConstructorUsedError;
  String? get organizationId => throw _privateConstructorUsedError;
  List<String>? get projectIds => throw _privateConstructorUsedError;
  String? get projectId => throw _privateConstructorUsedError;
  List<String>? get siteIds => throw _privateConstructorUsedError;

  /// Serializes this UserDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserDtoCopyWith<UserDto> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserDtoCopyWith<$Res> {
  factory $UserDtoCopyWith(UserDto value, $Res Function(UserDto) then) =
      _$UserDtoCopyWithImpl<$Res, UserDto>;
  @useResult
  $Res call(
      {String id,
      String? firstName,
      String? lastName,
      String? designation,
      String? contactNumber,
      String? address,
      String? email,
      String? otp,
      String? userType,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt,
      List<String>? roleIds,
      List<String>? visitIds,
      String? organizationId,
      List<String>? projectIds,
      String? projectId,
      List<String>? siteIds});
}

/// @nodoc
class _$UserDtoCopyWithImpl<$Res, $Val extends UserDto>
    implements $UserDtoCopyWith<$Res> {
  _$UserDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? designation = freezed,
    Object? contactNumber = freezed,
    Object? address = freezed,
    Object? email = freezed,
    Object? otp = freezed,
    Object? userType = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? roleIds = freezed,
    Object? visitIds = freezed,
    Object? organizationId = freezed,
    Object? projectIds = freezed,
    Object? projectId = freezed,
    Object? siteIds = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      firstName: freezed == firstName
          ? _value.firstName
          : firstName // ignore: cast_nullable_to_non_nullable
              as String?,
      lastName: freezed == lastName
          ? _value.lastName
          : lastName // ignore: cast_nullable_to_non_nullable
              as String?,
      designation: freezed == designation
          ? _value.designation
          : designation // ignore: cast_nullable_to_non_nullable
              as String?,
      contactNumber: freezed == contactNumber
          ? _value.contactNumber
          : contactNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      otp: freezed == otp
          ? _value.otp
          : otp // ignore: cast_nullable_to_non_nullable
              as String?,
      userType: freezed == userType
          ? _value.userType
          : userType // ignore: cast_nullable_to_non_nullable
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
      roleIds: freezed == roleIds
          ? _value.roleIds
          : roleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value.visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      organizationId: freezed == organizationId
          ? _value.organizationId
          : organizationId // ignore: cast_nullable_to_non_nullable
              as String?,
      projectIds: freezed == projectIds
          ? _value.projectIds
          : projectIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      siteIds: freezed == siteIds
          ? _value.siteIds
          : siteIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UserDtoImplCopyWith<$Res> implements $UserDtoCopyWith<$Res> {
  factory _$$UserDtoImplCopyWith(
          _$UserDtoImpl value, $Res Function(_$UserDtoImpl) then) =
      __$$UserDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? firstName,
      String? lastName,
      String? designation,
      String? contactNumber,
      String? address,
      String? email,
      String? otp,
      String? userType,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt,
      List<String>? roleIds,
      List<String>? visitIds,
      String? organizationId,
      List<String>? projectIds,
      String? projectId,
      List<String>? siteIds});
}

/// @nodoc
class __$$UserDtoImplCopyWithImpl<$Res>
    extends _$UserDtoCopyWithImpl<$Res, _$UserDtoImpl>
    implements _$$UserDtoImplCopyWith<$Res> {
  __$$UserDtoImplCopyWithImpl(
      _$UserDtoImpl _value, $Res Function(_$UserDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of UserDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? designation = freezed,
    Object? contactNumber = freezed,
    Object? address = freezed,
    Object? email = freezed,
    Object? otp = freezed,
    Object? userType = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? roleIds = freezed,
    Object? visitIds = freezed,
    Object? organizationId = freezed,
    Object? projectIds = freezed,
    Object? projectId = freezed,
    Object? siteIds = freezed,
  }) {
    return _then(_$UserDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      firstName: freezed == firstName
          ? _value.firstName
          : firstName // ignore: cast_nullable_to_non_nullable
              as String?,
      lastName: freezed == lastName
          ? _value.lastName
          : lastName // ignore: cast_nullable_to_non_nullable
              as String?,
      designation: freezed == designation
          ? _value.designation
          : designation // ignore: cast_nullable_to_non_nullable
              as String?,
      contactNumber: freezed == contactNumber
          ? _value.contactNumber
          : contactNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      address: freezed == address
          ? _value.address
          : address // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      otp: freezed == otp
          ? _value.otp
          : otp // ignore: cast_nullable_to_non_nullable
              as String?,
      userType: freezed == userType
          ? _value.userType
          : userType // ignore: cast_nullable_to_non_nullable
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
      roleIds: freezed == roleIds
          ? _value._roleIds
          : roleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitIds: freezed == visitIds
          ? _value._visitIds
          : visitIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      organizationId: freezed == organizationId
          ? _value.organizationId
          : organizationId // ignore: cast_nullable_to_non_nullable
              as String?,
      projectIds: freezed == projectIds
          ? _value._projectIds
          : projectIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      siteIds: freezed == siteIds
          ? _value._siteIds
          : siteIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserDtoImpl implements _UserDto {
  const _$UserDtoImpl(
      {required this.id,
      this.firstName,
      this.lastName,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.otp,
      this.userType,
      this.status,
      this.createdAt,
      this.updatedAt,
      final List<String>? roleIds,
      final List<String>? visitIds,
      this.organizationId,
      final List<String>? projectIds,
      this.projectId,
      final List<String>? siteIds})
      : _roleIds = roleIds,
        _visitIds = visitIds,
        _projectIds = projectIds,
        _siteIds = siteIds;

  factory _$UserDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? designation;
  @override
  final String? contactNumber;
  @override
  final String? address;
  @override
  final String? email;
  @override
  final String? otp;
  @override
  final String? userType;
  @override
  final String? status;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;
  final List<String>? _roleIds;
  @override
  List<String>? get roleIds {
    final value = _roleIds;
    if (value == null) return null;
    if (_roleIds is EqualUnmodifiableListView) return _roleIds;
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
  final String? organizationId;
  final List<String>? _projectIds;
  @override
  List<String>? get projectIds {
    final value = _projectIds;
    if (value == null) return null;
    if (_projectIds is EqualUnmodifiableListView) return _projectIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? projectId;
  final List<String>? _siteIds;
  @override
  List<String>? get siteIds {
    final value = _siteIds;
    if (value == null) return null;
    if (_siteIds is EqualUnmodifiableListView) return _siteIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  String toString() {
    return 'UserDto(id: $id, firstName: $firstName, lastName: $lastName, designation: $designation, contactNumber: $contactNumber, address: $address, email: $email, otp: $otp, userType: $userType, status: $status, createdAt: $createdAt, updatedAt: $updatedAt, roleIds: $roleIds, visitIds: $visitIds, organizationId: $organizationId, projectIds: $projectIds, projectId: $projectId, siteIds: $siteIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.designation, designation) ||
                other.designation == designation) &&
            (identical(other.contactNumber, contactNumber) ||
                other.contactNumber == contactNumber) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.otp, otp) || other.otp == otp) &&
            (identical(other.userType, userType) ||
                other.userType == userType) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality().equals(other._roleIds, _roleIds) &&
            const DeepCollectionEquality().equals(other._visitIds, _visitIds) &&
            (identical(other.organizationId, organizationId) ||
                other.organizationId == organizationId) &&
            const DeepCollectionEquality()
                .equals(other._projectIds, _projectIds) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            const DeepCollectionEquality().equals(other._siteIds, _siteIds));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      firstName,
      lastName,
      designation,
      contactNumber,
      address,
      email,
      otp,
      userType,
      status,
      createdAt,
      updatedAt,
      const DeepCollectionEquality().hash(_roleIds),
      const DeepCollectionEquality().hash(_visitIds),
      organizationId,
      const DeepCollectionEquality().hash(_projectIds),
      projectId,
      const DeepCollectionEquality().hash(_siteIds));

  /// Create a copy of UserDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserDtoImplCopyWith<_$UserDtoImpl> get copyWith =>
      __$$UserDtoImplCopyWithImpl<_$UserDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserDtoImplToJson(
      this,
    );
  }
}

abstract class _UserDto implements UserDto {
  const factory _UserDto(
      {required final String id,
      final String? firstName,
      final String? lastName,
      final String? designation,
      final String? contactNumber,
      final String? address,
      final String? email,
      final String? otp,
      final String? userType,
      final String? status,
      final DateTime? createdAt,
      final DateTime? updatedAt,
      final List<String>? roleIds,
      final List<String>? visitIds,
      final String? organizationId,
      final List<String>? projectIds,
      final String? projectId,
      final List<String>? siteIds}) = _$UserDtoImpl;

  factory _UserDto.fromJson(Map<String, dynamic> json) = _$UserDtoImpl.fromJson;

  @override
  String get id;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get designation;
  @override
  String? get contactNumber;
  @override
  String? get address;
  @override
  String? get email;
  @override
  String? get otp;
  @override
  String? get userType;
  @override
  String? get status;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;
  @override
  List<String>? get roleIds;
  @override
  List<String>? get visitIds;
  @override
  String? get organizationId;
  @override
  List<String>? get projectIds;
  @override
  String? get projectId;
  @override
  List<String>? get siteIds;

  /// Create a copy of UserDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserDtoImplCopyWith<_$UserDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
