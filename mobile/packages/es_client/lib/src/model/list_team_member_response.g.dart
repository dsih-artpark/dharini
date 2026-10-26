// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_team_member_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListTeamMemberResponse extends ListTeamMemberResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<TeamMemberResponseData> data;

  factory _$ListTeamMemberResponse(
          [void Function(ListTeamMemberResponseBuilder)? updates]) =>
      (ListTeamMemberResponseBuilder()..update(updates))._build();

  _$ListTeamMemberResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListTeamMemberResponse rebuild(
          void Function(ListTeamMemberResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListTeamMemberResponseBuilder toBuilder() =>
      ListTeamMemberResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListTeamMemberResponse &&
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
    return (newBuiltValueToStringHelper(r'ListTeamMemberResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListTeamMemberResponseBuilder
    implements Builder<ListTeamMemberResponse, ListTeamMemberResponseBuilder> {
  _$ListTeamMemberResponse? _$v;

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

  ListTeamMemberResponseBuilder() {
    ListTeamMemberResponse._defaults(this);
  }

  ListTeamMemberResponseBuilder get _$this {
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
  void replace(ListTeamMemberResponse other) {
    _$v = other as _$ListTeamMemberResponse;
  }

  @override
  void update(void Function(ListTeamMemberResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListTeamMemberResponse build() => _build();

  _$ListTeamMemberResponse _build() {
    _$ListTeamMemberResponse _$result;
    try {
      _$result = _$v ??
          _$ListTeamMemberResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListTeamMemberResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListTeamMemberResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListTeamMemberResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
