// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'invite_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

InviteDto _$InviteDtoFromJson(Map<String, dynamic> json) {
  return _InviteDto.fromJson(json);
}

/// @nodoc
mixin _$InviteDto {
  String get id => throw _privateConstructorUsedError;
  String? get invitedById => throw _privateConstructorUsedError;
  String? get inviteeType => throw _privateConstructorUsedError;
  String? get organizationName => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get organizationType => throw _privateConstructorUsedError;
  String? get email => throw _privateConstructorUsedError;
  String? get contactNumber => throw _privateConstructorUsedError;
  String? get projectId => throw _privateConstructorUsedError;
  String? get inviteToken => throw _privateConstructorUsedError;
  DateTime? get expirationDate => throw _privateConstructorUsedError;
  bool get accepted => throw _privateConstructorUsedError;
  String? get userType => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this InviteDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InviteDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InviteDtoCopyWith<InviteDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InviteDtoCopyWith<$Res> {
  factory $InviteDtoCopyWith(InviteDto value, $Res Function(InviteDto) then) =
      _$InviteDtoCopyWithImpl<$Res, InviteDto>;
  @useResult
  $Res call(
      {String id,
      String? invitedById,
      String? inviteeType,
      String? organizationName,
      String? firstName,
      String? lastName,
      String? organizationType,
      String? email,
      String? contactNumber,
      String? projectId,
      String? inviteToken,
      DateTime? expirationDate,
      bool accepted,
      String? userType,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class _$InviteDtoCopyWithImpl<$Res, $Val extends InviteDto>
    implements $InviteDtoCopyWith<$Res> {
  _$InviteDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InviteDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? invitedById = freezed,
    Object? inviteeType = freezed,
    Object? organizationName = freezed,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? organizationType = freezed,
    Object? email = freezed,
    Object? contactNumber = freezed,
    Object? projectId = freezed,
    Object? inviteToken = freezed,
    Object? expirationDate = freezed,
    Object? accepted = null,
    Object? userType = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      invitedById: freezed == invitedById
          ? _value.invitedById
          : invitedById // ignore: cast_nullable_to_non_nullable
              as String?,
      inviteeType: freezed == inviteeType
          ? _value.inviteeType
          : inviteeType // ignore: cast_nullable_to_non_nullable
              as String?,
      organizationName: freezed == organizationName
          ? _value.organizationName
          : organizationName // ignore: cast_nullable_to_non_nullable
              as String?,
      firstName: freezed == firstName
          ? _value.firstName
          : firstName // ignore: cast_nullable_to_non_nullable
              as String?,
      lastName: freezed == lastName
          ? _value.lastName
          : lastName // ignore: cast_nullable_to_non_nullable
              as String?,
      organizationType: freezed == organizationType
          ? _value.organizationType
          : organizationType // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      contactNumber: freezed == contactNumber
          ? _value.contactNumber
          : contactNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      inviteToken: freezed == inviteToken
          ? _value.inviteToken
          : inviteToken // ignore: cast_nullable_to_non_nullable
              as String?,
      expirationDate: freezed == expirationDate
          ? _value.expirationDate
          : expirationDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      accepted: null == accepted
          ? _value.accepted
          : accepted // ignore: cast_nullable_to_non_nullable
              as bool,
      userType: freezed == userType
          ? _value.userType
          : userType // ignore: cast_nullable_to_non_nullable
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
abstract class _$$InviteDtoImplCopyWith<$Res>
    implements $InviteDtoCopyWith<$Res> {
  factory _$$InviteDtoImplCopyWith(
          _$InviteDtoImpl value, $Res Function(_$InviteDtoImpl) then) =
      __$$InviteDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? invitedById,
      String? inviteeType,
      String? organizationName,
      String? firstName,
      String? lastName,
      String? organizationType,
      String? email,
      String? contactNumber,
      String? projectId,
      String? inviteToken,
      DateTime? expirationDate,
      bool accepted,
      String? userType,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class __$$InviteDtoImplCopyWithImpl<$Res>
    extends _$InviteDtoCopyWithImpl<$Res, _$InviteDtoImpl>
    implements _$$InviteDtoImplCopyWith<$Res> {
  __$$InviteDtoImplCopyWithImpl(
      _$InviteDtoImpl _value, $Res Function(_$InviteDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of InviteDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? invitedById = freezed,
    Object? inviteeType = freezed,
    Object? organizationName = freezed,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? organizationType = freezed,
    Object? email = freezed,
    Object? contactNumber = freezed,
    Object? projectId = freezed,
    Object? inviteToken = freezed,
    Object? expirationDate = freezed,
    Object? accepted = null,
    Object? userType = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_$InviteDtoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      invitedById: freezed == invitedById
          ? _value.invitedById
          : invitedById // ignore: cast_nullable_to_non_nullable
              as String?,
      inviteeType: freezed == inviteeType
          ? _value.inviteeType
          : inviteeType // ignore: cast_nullable_to_non_nullable
              as String?,
      organizationName: freezed == organizationName
          ? _value.organizationName
          : organizationName // ignore: cast_nullable_to_non_nullable
              as String?,
      firstName: freezed == firstName
          ? _value.firstName
          : firstName // ignore: cast_nullable_to_non_nullable
              as String?,
      lastName: freezed == lastName
          ? _value.lastName
          : lastName // ignore: cast_nullable_to_non_nullable
              as String?,
      organizationType: freezed == organizationType
          ? _value.organizationType
          : organizationType // ignore: cast_nullable_to_non_nullable
              as String?,
      email: freezed == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String?,
      contactNumber: freezed == contactNumber
          ? _value.contactNumber
          : contactNumber // ignore: cast_nullable_to_non_nullable
              as String?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      inviteToken: freezed == inviteToken
          ? _value.inviteToken
          : inviteToken // ignore: cast_nullable_to_non_nullable
              as String?,
      expirationDate: freezed == expirationDate
          ? _value.expirationDate
          : expirationDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      accepted: null == accepted
          ? _value.accepted
          : accepted // ignore: cast_nullable_to_non_nullable
              as bool,
      userType: freezed == userType
          ? _value.userType
          : userType // ignore: cast_nullable_to_non_nullable
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
class _$InviteDtoImpl implements _InviteDto {
  const _$InviteDtoImpl(
      {required this.id,
      this.invitedById,
      this.inviteeType,
      this.organizationName,
      this.firstName,
      this.lastName,
      this.organizationType,
      this.email,
      this.contactNumber,
      this.projectId,
      this.inviteToken,
      this.expirationDate,
      this.accepted = false,
      this.userType,
      this.createdAt,
      this.updatedAt});

  factory _$InviteDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$InviteDtoImplFromJson(json);

  @override
  final String id;
  @override
  final String? invitedById;
  @override
  final String? inviteeType;
  @override
  final String? organizationName;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? organizationType;
  @override
  final String? email;
  @override
  final String? contactNumber;
  @override
  final String? projectId;
  @override
  final String? inviteToken;
  @override
  final DateTime? expirationDate;
  @override
  @JsonKey()
  final bool accepted;
  @override
  final String? userType;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'InviteDto(id: $id, invitedById: $invitedById, inviteeType: $inviteeType, organizationName: $organizationName, firstName: $firstName, lastName: $lastName, organizationType: $organizationType, email: $email, contactNumber: $contactNumber, projectId: $projectId, inviteToken: $inviteToken, expirationDate: $expirationDate, accepted: $accepted, userType: $userType, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InviteDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.invitedById, invitedById) ||
                other.invitedById == invitedById) &&
            (identical(other.inviteeType, inviteeType) ||
                other.inviteeType == inviteeType) &&
            (identical(other.organizationName, organizationName) ||
                other.organizationName == organizationName) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.organizationType, organizationType) ||
                other.organizationType == organizationType) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.contactNumber, contactNumber) ||
                other.contactNumber == contactNumber) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            (identical(other.inviteToken, inviteToken) ||
                other.inviteToken == inviteToken) &&
            (identical(other.expirationDate, expirationDate) ||
                other.expirationDate == expirationDate) &&
            (identical(other.accepted, accepted) ||
                other.accepted == accepted) &&
            (identical(other.userType, userType) ||
                other.userType == userType) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      invitedById,
      inviteeType,
      organizationName,
      firstName,
      lastName,
      organizationType,
      email,
      contactNumber,
      projectId,
      inviteToken,
      expirationDate,
      accepted,
      userType,
      createdAt,
      updatedAt);

  /// Create a copy of InviteDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InviteDtoImplCopyWith<_$InviteDtoImpl> get copyWith =>
      __$$InviteDtoImplCopyWithImpl<_$InviteDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$InviteDtoImplToJson(
      this,
    );
  }
}

abstract class _InviteDto implements InviteDto {
  const factory _InviteDto(
      {required final String id,
      final String? invitedById,
      final String? inviteeType,
      final String? organizationName,
      final String? firstName,
      final String? lastName,
      final String? organizationType,
      final String? email,
      final String? contactNumber,
      final String? projectId,
      final String? inviteToken,
      final DateTime? expirationDate,
      final bool accepted,
      final String? userType,
      final DateTime? createdAt,
      final DateTime? updatedAt}) = _$InviteDtoImpl;

  factory _InviteDto.fromJson(Map<String, dynamic> json) =
      _$InviteDtoImpl.fromJson;

  @override
  String get id;
  @override
  String? get invitedById;
  @override
  String? get inviteeType;
  @override
  String? get organizationName;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get organizationType;
  @override
  String? get email;
  @override
  String? get contactNumber;
  @override
  String? get projectId;
  @override
  String? get inviteToken;
  @override
  DateTime? get expirationDate;
  @override
  bool get accepted;
  @override
  String? get userType;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of InviteDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InviteDtoImplCopyWith<_$InviteDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
