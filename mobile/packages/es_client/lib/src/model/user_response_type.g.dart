// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_response_type.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserResponseType extends UserResponseType {
  @override
  final String? firstName;
  @override
  final String id;
  @override
  final String? lastName;
  @override
  final String? address;
  @override
  final String? contactNumber;
  @override
  final String? designation;
  @override
  final String? email;

  factory _$UserResponseType(
          [void Function(UserResponseTypeBuilder)? updates]) =>
      (UserResponseTypeBuilder()..update(updates))._build();

  _$UserResponseType._(
      {this.firstName,
      required this.id,
      this.lastName,
      this.address,
      this.contactNumber,
      this.designation,
      this.email})
      : super._();
  @override
  UserResponseType rebuild(void Function(UserResponseTypeBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserResponseTypeBuilder toBuilder() =>
      UserResponseTypeBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserResponseType &&
        firstName == other.firstName &&
        id == other.id &&
        lastName == other.lastName &&
        address == other.address &&
        contactNumber == other.contactNumber &&
        designation == other.designation &&
        email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, designation.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserResponseType')
          ..add('firstName', firstName)
          ..add('id', id)
          ..add('lastName', lastName)
          ..add('address', address)
          ..add('contactNumber', contactNumber)
          ..add('designation', designation)
          ..add('email', email))
        .toString();
  }
}

class UserResponseTypeBuilder
    implements Builder<UserResponseType, UserResponseTypeBuilder> {
  _$UserResponseType? _$v;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _address;
  String? get address => _$this._address;
  set address(String? address) => _$this._address = address;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  String? _designation;
  String? get designation => _$this._designation;
  set designation(String? designation) => _$this._designation = designation;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  UserResponseTypeBuilder() {
    UserResponseType._defaults(this);
  }

  UserResponseTypeBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _id = $v.id;
      _lastName = $v.lastName;
      _address = $v.address;
      _contactNumber = $v.contactNumber;
      _designation = $v.designation;
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserResponseType other) {
    _$v = other as _$UserResponseType;
  }

  @override
  void update(void Function(UserResponseTypeBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserResponseType build() => _build();

  _$UserResponseType _build() {
    final _$result = _$v ??
        _$UserResponseType._(
          firstName: firstName,
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'UserResponseType', 'id'),
          lastName: lastName,
          address: address,
          contactNumber: contactNumber,
          designation: designation,
          email: email,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
