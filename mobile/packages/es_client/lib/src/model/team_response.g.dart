// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamResponse extends TeamResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final TeamResponseData data;

  factory _$TeamResponse([void Function(TeamResponseBuilder)? updates]) =>
      (TeamResponseBuilder()..update(updates))._build();

  _$TeamResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamResponse rebuild(void Function(TeamResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamResponseBuilder toBuilder() => TeamResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamResponse &&
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
    return (newBuiltValueToStringHelper(r'TeamResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamResponseBuilder
    implements Builder<TeamResponse, TeamResponseBuilder> {
  _$TeamResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  TeamResponseDataBuilder? _data;
  TeamResponseDataBuilder get data =>
      _$this._data ??= TeamResponseDataBuilder();
  set data(TeamResponseDataBuilder? data) => _$this._data = data;

  TeamResponseBuilder() {
    TeamResponse._defaults(this);
  }

  TeamResponseBuilder get _$this {
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
  void replace(TeamResponse other) {
    _$v = other as _$TeamResponse;
  }

  @override
  void update(void Function(TeamResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamResponse build() => _build();

  _$TeamResponse _build() {
    _$TeamResponse _$result;
    try {
      _$result = _$v ??
          _$TeamResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
