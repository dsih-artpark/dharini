// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'removed_team_member_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RemovedTeamMemberResponse extends RemovedTeamMemberResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<String> removedMembers;

  factory _$RemovedTeamMemberResponse(
          [void Function(RemovedTeamMemberResponseBuilder)? updates]) =>
      (RemovedTeamMemberResponseBuilder()..update(updates))._build();

  _$RemovedTeamMemberResponse._(
      {required this.success,
      required this.message,
      required this.removedMembers})
      : super._();
  @override
  RemovedTeamMemberResponse rebuild(
          void Function(RemovedTeamMemberResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RemovedTeamMemberResponseBuilder toBuilder() =>
      RemovedTeamMemberResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RemovedTeamMemberResponse &&
        success == other.success &&
        message == other.message &&
        removedMembers == other.removedMembers;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, removedMembers.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RemovedTeamMemberResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('removedMembers', removedMembers))
        .toString();
  }
}

class RemovedTeamMemberResponseBuilder
    implements
        Builder<RemovedTeamMemberResponse, RemovedTeamMemberResponseBuilder> {
  _$RemovedTeamMemberResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<String>? _removedMembers;
  ListBuilder<String> get removedMembers =>
      _$this._removedMembers ??= ListBuilder<String>();
  set removedMembers(ListBuilder<String>? removedMembers) =>
      _$this._removedMembers = removedMembers;

  RemovedTeamMemberResponseBuilder() {
    RemovedTeamMemberResponse._defaults(this);
  }

  RemovedTeamMemberResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _removedMembers = $v.removedMembers.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RemovedTeamMemberResponse other) {
    _$v = other as _$RemovedTeamMemberResponse;
  }

  @override
  void update(void Function(RemovedTeamMemberResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RemovedTeamMemberResponse build() => _build();

  _$RemovedTeamMemberResponse _build() {
    _$RemovedTeamMemberResponse _$result;
    try {
      _$result = _$v ??
          _$RemovedTeamMemberResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'RemovedTeamMemberResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'RemovedTeamMemberResponse', 'message'),
            removedMembers: removedMembers.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'removedMembers';
        removedMembers.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'RemovedTeamMemberResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
