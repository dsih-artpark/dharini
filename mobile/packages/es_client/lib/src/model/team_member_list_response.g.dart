// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_list_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberListResponse extends TeamMemberListResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<TeamMemberResponseData> data;

  factory _$TeamMemberListResponse(
          [void Function(TeamMemberListResponseBuilder)? updates]) =>
      (TeamMemberListResponseBuilder()..update(updates))._build();

  _$TeamMemberListResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamMemberListResponse rebuild(
          void Function(TeamMemberListResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberListResponseBuilder toBuilder() =>
      TeamMemberListResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberListResponse &&
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
    return (newBuiltValueToStringHelper(r'TeamMemberListResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamMemberListResponseBuilder
    implements Builder<TeamMemberListResponse, TeamMemberListResponseBuilder> {
  _$TeamMemberListResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<TeamMemberResponseData>? _data;
  ListBuilder<TeamMemberResponseData> get data =>
      _$this._data ??= ListBuilder<TeamMemberResponseData>();
  set data(ListBuilder<TeamMemberResponseData>? data) => _$this._data = data;

  TeamMemberListResponseBuilder() {
    TeamMemberListResponse._defaults(this);
  }

  TeamMemberListResponseBuilder get _$this {
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
  void replace(TeamMemberListResponse other) {
    _$v = other as _$TeamMemberListResponse;
  }

  @override
  void update(void Function(TeamMemberListResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberListResponse build() => _build();

  _$TeamMemberListResponse _build() {
    _$TeamMemberListResponse _$result;
    try {
      _$result = _$v ??
          _$TeamMemberListResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamMemberListResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamMemberListResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamMemberListResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
