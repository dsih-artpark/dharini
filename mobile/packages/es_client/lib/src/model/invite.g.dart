// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invite.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Invite extends Invite {
  @override
  final String id;
  @override
  final bool accepted;

  factory _$Invite([void Function(InviteBuilder)? updates]) =>
      (InviteBuilder()..update(updates))._build();

  _$Invite._({required this.id, required this.accepted}) : super._();
  @override
  Invite rebuild(void Function(InviteBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InviteBuilder toBuilder() => InviteBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Invite && id == other.id && accepted == other.accepted;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, accepted.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Invite')
          ..add('id', id)
          ..add('accepted', accepted))
        .toString();
  }
}

class InviteBuilder implements Builder<Invite, InviteBuilder> {
  _$Invite? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  bool? _accepted;
  bool? get accepted => _$this._accepted;
  set accepted(bool? accepted) => _$this._accepted = accepted;

  InviteBuilder() {
    Invite._defaults(this);
  }

  InviteBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _accepted = $v.accepted;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Invite other) {
    _$v = other as _$Invite;
  }

  @override
  void update(void Function(InviteBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Invite build() => _build();

  _$Invite _build() {
    final _$result = _$v ??
        _$Invite._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Invite', 'id'),
          accepted: BuiltValueNullFieldError.checkNotNull(
              accepted, r'Invite', 'accepted'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
