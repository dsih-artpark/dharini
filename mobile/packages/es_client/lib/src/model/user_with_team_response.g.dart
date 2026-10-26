// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_with_team_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserWithTeamResponse extends UserWithTeamResponse {
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
  final Team? team;

  factory _$UserWithTeamResponse(
          [void Function(UserWithTeamResponseBuilder)? updates]) =>
      (UserWithTeamResponseBuilder()..update(updates))._build();

  _$UserWithTeamResponse._(
      {this.firstName,
      required this.id,
      this.lastName,
      this.profilePicture,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.team})
      : super._();
  @override
  UserWithTeamResponse rebuild(
          void Function(UserWithTeamResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserWithTeamResponseBuilder toBuilder() =>
      UserWithTeamResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserWithTeamResponse &&
        firstName == other.firstName &&
        id == other.id &&
        lastName == other.lastName &&
        profilePicture == other.profilePicture &&
        designation == other.designation &&
        contactNumber == other.contactNumber &&
        address == other.address &&
        email == other.email &&
        team == other.team;
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
    _$hash = $jc(_$hash, team.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserWithTeamResponse')
          ..add('firstName', firstName)
          ..add('id', id)
          ..add('lastName', lastName)
          ..add('profilePicture', profilePicture)
          ..add('designation', designation)
          ..add('contactNumber', contactNumber)
          ..add('address', address)
          ..add('email', email)
          ..add('team', team))
        .toString();
  }
}

class UserWithTeamResponseBuilder
    implements Builder<UserWithTeamResponse, UserWithTeamResponseBuilder> {
  _$UserWithTeamResponse? _$v;

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

  TeamBuilder? _team;
  TeamBuilder get team => _$this._team ??= TeamBuilder();
  set team(TeamBuilder? team) => _$this._team = team;

  UserWithTeamResponseBuilder() {
    UserWithTeamResponse._defaults(this);
  }

  UserWithTeamResponseBuilder get _$this {
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
      _team = $v.team?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserWithTeamResponse other) {
    _$v = other as _$UserWithTeamResponse;
  }

  @override
  void update(void Function(UserWithTeamResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserWithTeamResponse build() => _build();

  _$UserWithTeamResponse _build() {
    _$UserWithTeamResponse _$result;
    try {
      _$result = _$v ??
          _$UserWithTeamResponse._(
            firstName: firstName,
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'UserWithTeamResponse', 'id'),
            lastName: lastName,
            profilePicture: profilePicture,
            designation: designation,
            contactNumber: contactNumber,
            address: address,
            email: email,
            team: _team?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'team';
        _team?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserWithTeamResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
