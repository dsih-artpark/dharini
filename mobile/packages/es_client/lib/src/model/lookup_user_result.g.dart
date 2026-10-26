// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lookup_user_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$LookupUserResult extends LookupUserResult {
  @override
  final bool exists;
  @override
  final LookupUserMatch? user;

  factory _$LookupUserResult(
          [void Function(LookupUserResultBuilder)? updates]) =>
      (LookupUserResultBuilder()..update(updates))._build();

  _$LookupUserResult._({required this.exists, this.user}) : super._();
  @override
  LookupUserResult rebuild(void Function(LookupUserResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  LookupUserResultBuilder toBuilder() =>
      LookupUserResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is LookupUserResult &&
        exists == other.exists &&
        user == other.user;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, exists.hashCode);
    _$hash = $jc(_$hash, user.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'LookupUserResult')
          ..add('exists', exists)
          ..add('user', user))
        .toString();
  }
}

class LookupUserResultBuilder
    implements Builder<LookupUserResult, LookupUserResultBuilder> {
  _$LookupUserResult? _$v;

  bool? _exists;
  bool? get exists => _$this._exists;
  set exists(bool? exists) => _$this._exists = exists;

  LookupUserMatchBuilder? _user;
  LookupUserMatchBuilder get user => _$this._user ??= LookupUserMatchBuilder();
  set user(LookupUserMatchBuilder? user) => _$this._user = user;

  LookupUserResultBuilder() {
    LookupUserResult._defaults(this);
  }

  LookupUserResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _exists = $v.exists;
      _user = $v.user?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(LookupUserResult other) {
    _$v = other as _$LookupUserResult;
  }

  @override
  void update(void Function(LookupUserResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  LookupUserResult build() => _build();

  _$LookupUserResult _build() {
    _$LookupUserResult _$result;
    try {
      _$result = _$v ??
          _$LookupUserResult._(
            exists: BuiltValueNullFieldError.checkNotNull(
                exists, r'LookupUserResult', 'exists'),
            user: _user?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'user';
        _user?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'LookupUserResult', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
