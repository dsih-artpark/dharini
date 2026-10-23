// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list_team_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$ListTeamResponse extends ListTeamResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final BuiltList<TeamResponseData> data;

  factory _$ListTeamResponse(
          [void Function(ListTeamResponseBuilder)? updates]) =>
      (ListTeamResponseBuilder()..update(updates))._build();

  _$ListTeamResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  ListTeamResponse rebuild(void Function(ListTeamResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ListTeamResponseBuilder toBuilder() =>
      ListTeamResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ListTeamResponse &&
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
    return (newBuiltValueToStringHelper(r'ListTeamResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class ListTeamResponseBuilder
    implements Builder<ListTeamResponse, ListTeamResponseBuilder> {
  _$ListTeamResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  ListBuilder<TeamResponseData>? _data;
  ListBuilder<TeamResponseData> get data =>
      _$this._data ??= ListBuilder<TeamResponseData>();
  set data(ListBuilder<TeamResponseData>? data) => _$this._data = data;

  ListTeamResponseBuilder() {
    ListTeamResponse._defaults(this);
  }

  ListTeamResponseBuilder get _$this {
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
  void replace(ListTeamResponse other) {
    _$v = other as _$ListTeamResponse;
  }

  @override
  void update(void Function(ListTeamResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ListTeamResponse build() => _build();

  _$ListTeamResponse _build() {
    _$ListTeamResponse _$result;
    try {
      _$result = _$v ??
          _$ListTeamResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'ListTeamResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'ListTeamResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'ListTeamResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
