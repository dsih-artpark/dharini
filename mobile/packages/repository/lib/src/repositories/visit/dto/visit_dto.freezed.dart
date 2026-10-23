// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'visit_dto.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

VisitDto _$VisitDtoFromJson(Map<String, dynamic> json) {
  return _VisitDto.fromJson(json);
}

/// @nodoc
mixin _$VisitDto {
  String? get id => throw _privateConstructorUsedError;
  String? get projectId => throw _privateConstructorUsedError;
  String? get siteId => throw _privateConstructorUsedError;
  String? get questionSetId => throw _privateConstructorUsedError;
  List<String>? get sampleIds => throw _privateConstructorUsedError;
  DateTime? get visitDateTime => throw _privateConstructorUsedError;
  DateTime? get visitScheduleDateTime => throw _privateConstructorUsedError;
  String get visitStatus => throw _privateConstructorUsedError;
  List<String>? get collectorIds => throw _privateConstructorUsedError;
  String? get status => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this VisitDto to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of VisitDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $VisitDtoCopyWith<VisitDto> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VisitDtoCopyWith<$Res> {
  factory $VisitDtoCopyWith(VisitDto value, $Res Function(VisitDto) then) =
      _$VisitDtoCopyWithImpl<$Res, VisitDto>;
  @useResult
  $Res call(
      {String? id,
      String? projectId,
      String? siteId,
      String? questionSetId,
      List<String>? sampleIds,
      DateTime? visitDateTime,
      DateTime? visitScheduleDateTime,
      String visitStatus,
      List<String>? collectorIds,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class _$VisitDtoCopyWithImpl<$Res, $Val extends VisitDto>
    implements $VisitDtoCopyWith<$Res> {
  _$VisitDtoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of VisitDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? projectId = freezed,
    Object? siteId = freezed,
    Object? questionSetId = freezed,
    Object? sampleIds = freezed,
    Object? visitDateTime = freezed,
    Object? visitScheduleDateTime = freezed,
    Object? visitStatus = null,
    Object? collectorIds = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      siteId: freezed == siteId
          ? _value.siteId
          : siteId // ignore: cast_nullable_to_non_nullable
              as String?,
      questionSetId: freezed == questionSetId
          ? _value.questionSetId
          : questionSetId // ignore: cast_nullable_to_non_nullable
              as String?,
      sampleIds: freezed == sampleIds
          ? _value.sampleIds
          : sampleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitDateTime: freezed == visitDateTime
          ? _value.visitDateTime
          : visitDateTime // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      visitScheduleDateTime: freezed == visitScheduleDateTime
          ? _value.visitScheduleDateTime
          : visitScheduleDateTime // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      visitStatus: null == visitStatus
          ? _value.visitStatus
          : visitStatus // ignore: cast_nullable_to_non_nullable
              as String,
      collectorIds: freezed == collectorIds
          ? _value.collectorIds
          : collectorIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
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
abstract class _$$VisitDtoImplCopyWith<$Res>
    implements $VisitDtoCopyWith<$Res> {
  factory _$$VisitDtoImplCopyWith(
          _$VisitDtoImpl value, $Res Function(_$VisitDtoImpl) then) =
      __$$VisitDtoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String? id,
      String? projectId,
      String? siteId,
      String? questionSetId,
      List<String>? sampleIds,
      DateTime? visitDateTime,
      DateTime? visitScheduleDateTime,
      String visitStatus,
      List<String>? collectorIds,
      String? status,
      DateTime? createdAt,
      DateTime? updatedAt});
}

/// @nodoc
class __$$VisitDtoImplCopyWithImpl<$Res>
    extends _$VisitDtoCopyWithImpl<$Res, _$VisitDtoImpl>
    implements _$$VisitDtoImplCopyWith<$Res> {
  __$$VisitDtoImplCopyWithImpl(
      _$VisitDtoImpl _value, $Res Function(_$VisitDtoImpl) _then)
      : super(_value, _then);

  /// Create a copy of VisitDto
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? projectId = freezed,
    Object? siteId = freezed,
    Object? questionSetId = freezed,
    Object? sampleIds = freezed,
    Object? visitDateTime = freezed,
    Object? visitScheduleDateTime = freezed,
    Object? visitStatus = null,
    Object? collectorIds = freezed,
    Object? status = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(_$VisitDtoImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String?,
      projectId: freezed == projectId
          ? _value.projectId
          : projectId // ignore: cast_nullable_to_non_nullable
              as String?,
      siteId: freezed == siteId
          ? _value.siteId
          : siteId // ignore: cast_nullable_to_non_nullable
              as String?,
      questionSetId: freezed == questionSetId
          ? _value.questionSetId
          : questionSetId // ignore: cast_nullable_to_non_nullable
              as String?,
      sampleIds: freezed == sampleIds
          ? _value._sampleIds
          : sampleIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      visitDateTime: freezed == visitDateTime
          ? _value.visitDateTime
          : visitDateTime // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      visitScheduleDateTime: freezed == visitScheduleDateTime
          ? _value.visitScheduleDateTime
          : visitScheduleDateTime // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      visitStatus: null == visitStatus
          ? _value.visitStatus
          : visitStatus // ignore: cast_nullable_to_non_nullable
              as String,
      collectorIds: freezed == collectorIds
          ? _value._collectorIds
          : collectorIds // ignore: cast_nullable_to_non_nullable
              as List<String>?,
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
class _$VisitDtoImpl implements _VisitDto {
  const _$VisitDtoImpl(
      {this.id,
      this.projectId,
      this.siteId,
      this.questionSetId,
      final List<String>? sampleIds,
      this.visitDateTime,
      this.visitScheduleDateTime,
      this.visitStatus = 'upcoming',
      final List<String>? collectorIds,
      this.status,
      this.createdAt,
      this.updatedAt})
      : _sampleIds = sampleIds,
        _collectorIds = collectorIds;

  factory _$VisitDtoImpl.fromJson(Map<String, dynamic> json) =>
      _$$VisitDtoImplFromJson(json);

  @override
  final String? id;
  @override
  final String? projectId;
  @override
  final String? siteId;
  @override
  final String? questionSetId;
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
  final DateTime? visitDateTime;
  @override
  final DateTime? visitScheduleDateTime;
  @override
  @JsonKey()
  final String visitStatus;
  final List<String>? _collectorIds;
  @override
  List<String>? get collectorIds {
    final value = _collectorIds;
    if (value == null) return null;
    if (_collectorIds is EqualUnmodifiableListView) return _collectorIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? status;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'VisitDto(id: $id, projectId: $projectId, siteId: $siteId, questionSetId: $questionSetId, sampleIds: $sampleIds, visitDateTime: $visitDateTime, visitScheduleDateTime: $visitScheduleDateTime, visitStatus: $visitStatus, collectorIds: $collectorIds, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VisitDtoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            (identical(other.siteId, siteId) || other.siteId == siteId) &&
            (identical(other.questionSetId, questionSetId) ||
                other.questionSetId == questionSetId) &&
            const DeepCollectionEquality()
                .equals(other._sampleIds, _sampleIds) &&
            (identical(other.visitDateTime, visitDateTime) ||
                other.visitDateTime == visitDateTime) &&
            (identical(other.visitScheduleDateTime, visitScheduleDateTime) ||
                other.visitScheduleDateTime == visitScheduleDateTime) &&
            (identical(other.visitStatus, visitStatus) ||
                other.visitStatus == visitStatus) &&
            const DeepCollectionEquality()
                .equals(other._collectorIds, _collectorIds) &&
            (identical(other.status, status) || other.status == status) &&
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
      projectId,
      siteId,
      questionSetId,
      const DeepCollectionEquality().hash(_sampleIds),
      visitDateTime,
      visitScheduleDateTime,
      visitStatus,
      const DeepCollectionEquality().hash(_collectorIds),
      status,
      createdAt,
      updatedAt);

  /// Create a copy of VisitDto
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$VisitDtoImplCopyWith<_$VisitDtoImpl> get copyWith =>
      __$$VisitDtoImplCopyWithImpl<_$VisitDtoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$VisitDtoImplToJson(
      this,
    );
  }
}

abstract class _VisitDto implements VisitDto {
  const factory _VisitDto(
      {final String? id,
      final String? projectId,
      final String? siteId,
      final String? questionSetId,
      final List<String>? sampleIds,
      final DateTime? visitDateTime,
      final DateTime? visitScheduleDateTime,
      final String visitStatus,
      final List<String>? collectorIds,
      final String? status,
      final DateTime? createdAt,
      final DateTime? updatedAt}) = _$VisitDtoImpl;

  factory _VisitDto.fromJson(Map<String, dynamic> json) =
      _$VisitDtoImpl.fromJson;

  @override
  String? get id;
  @override
  String? get projectId;
  @override
  String? get siteId;
  @override
  String? get questionSetId;
  @override
  List<String>? get sampleIds;
  @override
  DateTime? get visitDateTime;
  @override
  DateTime? get visitScheduleDateTime;
  @override
  String get visitStatus;
  @override
  List<String>? get collectorIds;
  @override
  String? get status;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of VisitDto
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$VisitDtoImplCopyWith<_$VisitDtoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
