// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_progress_response_data_collection_collector.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamProgressResponseDataCollectionCollector
    extends TeamProgressResponseDataCollectionCollector {
  @override
  final String? id;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? email;

  factory _$TeamProgressResponseDataCollectionCollector(
          [void Function(TeamProgressResponseDataCollectionCollectorBuilder)?
              updates]) =>
      (TeamProgressResponseDataCollectionCollectorBuilder()..update(updates))
          ._build();

  _$TeamProgressResponseDataCollectionCollector._(
      {this.id, this.firstName, this.lastName, this.email})
      : super._();
  @override
  TeamProgressResponseDataCollectionCollector rebuild(
          void Function(TeamProgressResponseDataCollectionCollectorBuilder)
              updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamProgressResponseDataCollectionCollectorBuilder toBuilder() =>
      TeamProgressResponseDataCollectionCollectorBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamProgressResponseDataCollectionCollector &&
        id == other.id &&
        firstName == other.firstName &&
        lastName == other.lastName &&
        email == other.email;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, firstName.hashCode);
    _$hash = $jc(_$hash, lastName.hashCode);
    _$hash = $jc(_$hash, email.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(
            r'TeamProgressResponseDataCollectionCollector')
          ..add('id', id)
          ..add('firstName', firstName)
          ..add('lastName', lastName)
          ..add('email', email))
        .toString();
  }
}

class TeamProgressResponseDataCollectionCollectorBuilder
    implements
        Builder<TeamProgressResponseDataCollectionCollector,
            TeamProgressResponseDataCollectionCollectorBuilder> {
  _$TeamProgressResponseDataCollectionCollector? _$v;

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

  TeamProgressResponseDataCollectionCollectorBuilder() {
    TeamProgressResponseDataCollectionCollector._defaults(this);
  }

  TeamProgressResponseDataCollectionCollectorBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _firstName = $v.firstName;
      _lastName = $v.lastName;
      _email = $v.email;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamProgressResponseDataCollectionCollector other) {
    _$v = other as _$TeamProgressResponseDataCollectionCollector;
  }

  @override
  void update(
      void Function(TeamProgressResponseDataCollectionCollectorBuilder)?
          updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamProgressResponseDataCollectionCollector build() => _build();

  _$TeamProgressResponseDataCollectionCollector _build() {
    final _$result = _$v ??
        _$TeamProgressResponseDataCollectionCollector._(
          id: id,
          firstName: firstName,
          lastName: lastName,
          email: email,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
