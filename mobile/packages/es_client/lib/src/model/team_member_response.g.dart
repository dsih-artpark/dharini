// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberResponse extends TeamMemberResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final TeamMemberResponseData data;

  factory _$TeamMemberResponse(
          [void Function(TeamMemberResponseBuilder)? updates]) =>
      (TeamMemberResponseBuilder()..update(updates))._build();

  _$TeamMemberResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamMemberResponse rebuild(
          void Function(TeamMemberResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberResponseBuilder toBuilder() =>
      TeamMemberResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberResponse &&
        success == other.success &&
        message == other.message &&
        data == other.data;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, success.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, data.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TeamMemberResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamMemberResponseBuilder
    implements Builder<TeamMemberResponse, TeamMemberResponseBuilder> {
  _$TeamMemberResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  TeamMemberResponseDataBuilder? _data;
  TeamMemberResponseDataBuilder get data =>
      _$this._data ??= TeamMemberResponseDataBuilder();
  set data(TeamMemberResponseDataBuilder? data) => _$this._data = data;

  TeamMemberResponseBuilder() {
    TeamMemberResponse._defaults(this);
  }

  TeamMemberResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _success = $v.success;
      _message = $v.message;
      _data = $v.data.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TeamMemberResponse other) {
    _$v = other as _$TeamMemberResponse;
  }

  @override
  void update(void Function(TeamMemberResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberResponse build() => _build();

  _$TeamMemberResponse _build() {
    _$TeamMemberResponse _$result;
    try {
      _$result = _$v ??
          _$TeamMemberResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamMemberResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamMemberResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamMemberResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
