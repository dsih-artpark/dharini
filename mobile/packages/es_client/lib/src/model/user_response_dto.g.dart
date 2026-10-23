// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_response_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserResponseDto extends UserResponseDto {
  @override
  final String? firstName;
  @override
  final String id;
  @override
  final String? lastName;
  @override
  final String? email;

  factory _$UserResponseDto([void Function(UserResponseDtoBuilder)? updates]) =>
      (UserResponseDtoBuilder()..update(updates))._build();

  _$UserResponseDto._(
      {this.firstName, required this.id, this.lastName, this.email})
      : super._();
  @override
  UserResponseDto rebuild(void Function(UserResponseDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserResponseDtoBuilder toBuilder() => UserResponseDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserResponseDto &&
        firstName == other.firstName &&
        id == other.id &&
        lastName == other.lastName &&
        email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserResponseDto')
          ..add('firstName', firstName)
          ..add('id', id)
          ..add('lastName', lastName)
          ..add('email', email))
        .toString();
  }
}

class UserResponseDtoBuilder
    implements Builder<UserResponseDto, UserResponseDtoBuilder> {
  _$UserResponseDto? _$v;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  UserResponseDtoBuilder() {
    UserResponseDto._defaults(this);
  }

  UserResponseDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _id = $v.id;
      _lastName = $v.lastName;
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserResponseDto other) {
    _$v = other as _$UserResponseDto;
  }

  @override
  void update(void Function(UserResponseDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserResponseDto build() => _build();

  _$UserResponseDto _build() {
    final _$result = _$v ??
        _$UserResponseDto._(
          firstName: firstName,
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'UserResponseDto', 'id'),
          lastName: lastName,
          email: email,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
