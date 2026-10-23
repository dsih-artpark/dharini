// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lookup_user_match.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LookupUserMatch extends LookupUserMatch {
  @override
  final String id;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? email;
  @override
  final String? contactNumber;

  factory _$LookupUserMatch([void Function(LookupUserMatchBuilder)? updates]) =>
      (LookupUserMatchBuilder()..update(updates))._build();

  _$LookupUserMatch._(
      {required this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.contactNumber})
      : super._();
  @override
  LookupUserMatch rebuild(void Function(LookupUserMatchBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LookupUserMatchBuilder toBuilder() => LookupUserMatchBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LookupUserMatch &&
        id == other.id &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        email == other.email &&
        contactNumber == other.contactNumber;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jc(_$hash, contactNumber.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LookupUserMatch')
          ..add('id', id)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('email', email)
          ..add('contactNumber', contactNumber))
        .toString();
  }
}

class LookupUserMatchBuilder
    implements Builder<LookupUserMatch, LookupUserMatchBuilder> {
  _$LookupUserMatch? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _firstName;
  String? get firstName => _$this._firstName;
  set firstName(String? firstName) => _$this._firstName = firstName;

  String? _lastName;
  String? get lastName => _$this._lastName;
  set lastName(String? lastName) => _$this._lastName = lastName;

  String? _email;
  String? get email => _$this._email;
  set email(String? email) => _$this._email = email;

  String? _contactNumber;
  String? get contactNumber => _$this._contactNumber;
  set contactNumber(String? contactNumber) =>
      _$this._contactNumber = contactNumber;

  LookupUserMatchBuilder() {
    LookupUserMatch._defaults(this);
  }

  LookupUserMatchBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _email = $v.email;
      _contactNumber = $v.contactNumber;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LookupUserMatch other) {
    _$v = other as _$LookupUserMatch;
  }

  @override
  void update(void Function(LookupUserMatchBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LookupUserMatch build() => _build();

  _$LookupUserMatch _build() {
    final _$result = _$v ??
        _$LookupUserMatch._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'LookupUserMatch', 'id'),
          firstName: firstName,
          lastName: lastName,
          email: email,
          contactNumber: contactNumber,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
