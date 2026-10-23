// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_response_data.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$UserProfileResponseData extends UserProfileResponseData {
  @override
  final String? firstName;
  @override
  final BuiltList<UserProfileResponseDataUserRole> roles;
  @override
  final Team? team;
  @override
  final Project? project;
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

  factory _$UserProfileResponseData(
          [void Function(UserProfileResponseDataBuilder)? updates]) =>
      (UserProfileResponseDataBuilder()..update(updates))._build();

  _$UserProfileResponseData._(
      {this.firstName,
      required this.roles,
      this.team,
      this.project,
      required this.id,
      this.lastName,
      this.profilePicture,
      this.designation,
      this.contactNumber,
      this.address,
      this.email})
      : super._();
  @override
  UserProfileResponseData rebuild(
          void Function(UserProfileResponseDataBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  UserProfileResponseDataBuilder toBuilder() =>
      UserProfileResponseDataBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is UserProfileResponseData &&
        firstName == other.firstName &&
        roles == other.roles &&
        team == other.team &&
        project == other.project &&
        id == other.id &&
        lastName == other.lastName &&
        profilePicture == other.profilePicture &&
        designation == other.designation &&
        contactNumber == other.contactNumber &&
        address == other.address &&
        email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, roles.hashCode);
    _$hash = $jc(_$hash, team.hashCode);
    _$hash = $jc(_$hash, project.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, profilePicture.hashCode);
    _$hash = $jc(_$hash, designation.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jc(_$hash, address.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'UserProfileResponseData')
          ..add('firstName', firstName)
          ..add('roles', roles)
          ..add('team', team)
          ..add('project', project)
          ..add('id', id)
          ..add('lastName', lastName)
          ..add('profilePicture', profilePicture)
          ..add('designation', designation)
          ..add('contactNumber', contactNumber)
          ..add('address', address)
          ..add('email', email))
        .toString();
  }
}

class UserProfileResponseDataBuilder
    implements
        Builder<UserProfileResponseData, UserProfileResponseDataBuilder> {
  _$UserProfileResponseData? _$v;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  ListBuilder<UserProfileResponseDataUserRole>? _roles;
  ListBuilder<UserProfileResponseDataUserRole> get roles =>
      _$this._roles ??= ListBuilder<UserProfileResponseDataUserRole>();
  set roles(ListBuilder<UserProfileResponseDataUserRole>? roles) =>
      _$this._roles = roles;

  TeamBuilder? _team;
  TeamBuilder get team => _$this._team ??= TeamBuilder();
  set team(TeamBuilder? team) => _$this._team = team;

  ProjectBuilder? _project;
  ProjectBuilder get project => _$this._project ??= ProjectBuilder();
  set project(ProjectBuilder? project) => _$this._project = project;

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

  UserProfileResponseDataBuilder() {
    UserProfileResponseData._defaults(this);
  }

  UserProfileResponseDataBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _firstName = $v.firstName;
      _roles = $v.roles.toBuilder();
      _team = $v.team?.toBuilder();
      _project = $v.project?.toBuilder();
      _id = $v.id;
      _lastName = $v.lastName;
      _profilePicture = $v.profilePicture;
      _designation = $v.designation;
      _contactNumber = $v.contactNumber;
      _address = $v.address;
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(UserProfileResponseData other) {
    _$v = other as _$UserProfileResponseData;
  }

  @override
  void update(void Function(UserProfileResponseDataBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  UserProfileResponseData build() => _build();

  _$UserProfileResponseData _build() {
    _$UserProfileResponseData _$result;
    try {
      _$result = _$v ??
          _$UserProfileResponseData._(
            firstName: firstName,
            roles: roles.build(),
            team: _team?.build(),
            project: _project?.build(),
            id: BuiltValueNullFieldError.checkNotNull(
                id, r'UserProfileResponseData', 'id'),
            lastName: lastName,
            profilePicture: profilePicture,
            designation: designation,
            contactNumber: contactNumber,
            address: address,
            email: email,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'roles';
        roles.build();
        _$failedField = 'team';
        _team?.build();
        _$failedField = 'project';
        _project?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'UserProfileResponseData', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
