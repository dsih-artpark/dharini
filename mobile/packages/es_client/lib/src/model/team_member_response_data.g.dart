// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberResponseData extends TeamMemberResponseData {
  @override
  final String? firstName;
  @override
  final String id;
  @override
  final String? lastName;
  @override
  final String? profilePicture;
  @override
  final String? designation;
  @override
  final String? contactNumber;
  @override
  final String? address;
  @override
  final String? email;
  @override
  final BuiltList<UserRole>? roles;

  factory _$TeamMemberResponseData(
          [void Function(TeamMemberResponseDataBuilder)? updates]) =>
      (TeamMemberResponseDataBuilder()..update(updates))._build();

  _$TeamMemberResponseData._(
      {this.firstName,
      required this.id,
      this.lastName,
      this.profilePicture,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.roles})
      : super._();
  @override
  TeamMemberResponseData rebuild(
          void Function(TeamMemberResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberResponseDataBuilder toBuilder() =>
      TeamMemberResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberResponseData &&
        firstName == other.firstName &&
        id == other.id &&
        lastName == other.lastName &&
        profilePicture == other.profilePicture &&
        designation == other.designation &&
        contactNumber == other.contactNumber &&
        address == other.address &&
        email == other.email &&
        roles == other.roles;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, profilePicture.hashCode);
    _$hash = $jc(_$hash, designation.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, roles.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamMemberResponseData')
          ..add('firstName', firstName)
          ..add('id', id)
          ..add('lastName', lastName)
          ..add('profilePicture', profilePicture)
          ..add('designation', designation)
          ..add('contactNumber', contactNumber)
          ..add('address', address)
          ..add('email', email)
          ..add('roles', roles))
        .toString();
  }
}

class TeamMemberResponseDataBuilder
    implements Builder<TeamMemberResponseData, TeamMemberResponseDataBuilder> {
  _$TeamMemberResponseData? _$v;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _profilePicture;
  String? get profilePicture => _$this._profilePicture;
  set profilePicture(String? profilePicture) =>
      _$this._profilePicture = profilePicture;

  String? _designation;
  String? get designation => _$this._designation;
  set designation(String? designation) => _$this._designation = designation;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  String? _address;
  String? get address => _$this._address;
  set address(String? address) => _$this._address = address;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  ListBuilder<UserRole>? _roles;
  ListBuilder<UserRole> get roles => _$this._roles ??= ListBuilder<UserRole>();
  set roles(ListBuilder<UserRole>? roles) => _$this._roles = roles;

  TeamMemberResponseDataBuilder() {
    TeamMemberResponseData._defaults(this);
  }

  TeamMemberResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _id = $v.id;
      _lastName = $v.lastName;
      _profilePicture = $v.profilePicture;
      _designation = $v.designation;
      _contactNumber = $v.contactNumber;
      _address = $v.address;
      _email = $v.email;
      _roles = $v.roles?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamMemberResponseData other) {
    _$v = other as _$TeamMemberResponseData;
  }

  @override
  void update(void Function(TeamMemberResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberResponseData build() => _build();

  _$TeamMemberResponseData _build() {
    _$TeamMemberResponseData _$result;
    try {
      _$result = _$v ??
          _$TeamMemberResponseData._(
            firstName: firstName,
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'TeamMemberResponseData', 'id'),
            lastName: lastName,
            profilePicture: profilePicture,
            designation: designation,
            contactNumber: contactNumber,
            address: address,
            email: email,
            roles: _roles?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'roles';
        _roles?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamMemberResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
