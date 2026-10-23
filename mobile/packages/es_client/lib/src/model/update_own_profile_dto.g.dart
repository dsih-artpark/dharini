// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_own_profile_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UpdateOwnProfileDto extends UpdateOwnProfileDto {
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? designation;

  factory _$UpdateOwnProfileDto(
          [void Function(UpdateOwnProfileDtoBuilder)? updates]) =>
      (UpdateOwnProfileDtoBuilder()..update(updates))._build();

  _$UpdateOwnProfileDto._({this.firstName, this.lastName, this.designation})
      : super._();
  @override
  UpdateOwnProfileDto rebuild(
          void Function(UpdateOwnProfileDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UpdateOwnProfileDtoBuilder toBuilder() =>
      UpdateOwnProfileDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UpdateOwnProfileDto &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        designation == other.designation;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, designation.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UpdateOwnProfileDto')
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('designation', designation))
        .toString();
  }
}

class UpdateOwnProfileDtoBuilder
    implements Builder<UpdateOwnProfileDto, UpdateOwnProfileDtoBuilder> {
  _$UpdateOwnProfileDto? _$v;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _designation;
  String? get designation => _$this._designation;
  set designation(String? designation) => _$this._designation = designation;

  UpdateOwnProfileDtoBuilder() {
    UpdateOwnProfileDto._defaults(this);
  }

  UpdateOwnProfileDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _designation = $v.designation;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UpdateOwnProfileDto other) {
    _$v = other as _$UpdateOwnProfileDto;
  }

  @override
  void update(void Function(UpdateOwnProfileDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UpdateOwnProfileDto build() => _build();

  _$UpdateOwnProfileDto _build() {
    final _$result = _$v ??
        _$UpdateOwnProfileDto._(
          firstName: firstName,
          lastName: lastName,
          designation: designation,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
