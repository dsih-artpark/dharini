// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_member_activity_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamMemberActivityResponse extends TeamMemberActivityResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<MembersActivityDataType> data;

  factory _$TeamMemberActivityResponse(
          [void Function(TeamMemberActivityResponseBuilder)? updates]) =>
      (TeamMemberActivityResponseBuilder()..update(updates))._build();

  _$TeamMemberActivityResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamMemberActivityResponse rebuild(
          void Function(TeamMemberActivityResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamMemberActivityResponseBuilder toBuilder() =>
      TeamMemberActivityResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamMemberActivityResponse &&
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
    return (newBuiltValueToStringHelper(r'TeamMemberActivityResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamMemberActivityResponseBuilder
    implements
        Builder<TeamMemberActivityResponse, TeamMemberActivityResponseBuilder> {
  _$TeamMemberActivityResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<MembersActivityDataType>? _data;
  ListBuilder<MembersActivityDataType> get data =>
      _$this._data ??= ListBuilder<MembersActivityDataType>();
  set data(ListBuilder<MembersActivityDataType>? data) => _$this._data = data;

  TeamMemberActivityResponseBuilder() {
    TeamMemberActivityResponse._defaults(this);
  }

  TeamMemberActivityResponseBuilder get _$this {
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
  void replace(TeamMemberActivityResponse other) {
    _$v = other as _$TeamMemberActivityResponse;
  }

  @override
  void update(void Function(TeamMemberActivityResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamMemberActivityResponse build() => _build();

  _$TeamMemberActivityResponse _build() {
    _$TeamMemberActivityResponse _$result;
    try {
      _$result = _$v ??
          _$TeamMemberActivityResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamMemberActivityResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamMemberActivityResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamMemberActivityResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
