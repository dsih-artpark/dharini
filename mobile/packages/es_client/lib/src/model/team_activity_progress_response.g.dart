// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_activity_progress_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TeamActivityProgressResponse extends TeamActivityProgressResponse {
  @override
  final bool success;
  @override
  final String message;
  @override
  final TeamActivityProgressResponseData data;

  factory _$TeamActivityProgressResponse(
          [void Function(TeamActivityProgressResponseBuilder)? updates]) =>
      (TeamActivityProgressResponseBuilder()..update(updates))._build();

  _$TeamActivityProgressResponse._(
      {required this.success, required this.message, required this.data})
      : super._();
  @override
  TeamActivityProgressResponse rebuild(
          void Function(TeamActivityProgressResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TeamActivityProgressResponseBuilder toBuilder() =>
      TeamActivityProgressResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TeamActivityProgressResponse &&
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
    return (newBuiltValueToStringHelper(r'TeamActivityProgressResponse')
          ..add('success', success)
          ..add('message', message)
          ..add('data', data))
        .toString();
  }
}

class TeamActivityProgressResponseBuilder
    implements
        Builder<TeamActivityProgressResponse,
            TeamActivityProgressResponseBuilder> {
  _$TeamActivityProgressResponse? _$v;

  bool? _success;
  bool? get success => _$this._success;
  set success(bool? success) => _$this._success = success;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  TeamActivityProgressResponseDataBuilder? _data;
  TeamActivityProgressResponseDataBuilder get data =>
      _$this._data ??= TeamActivityProgressResponseDataBuilder();
  set data(TeamActivityProgressResponseDataBuilder? data) =>
      _$this._data = data;

  TeamActivityProgressResponseBuilder() {
    TeamActivityProgressResponse._defaults(this);
  }

  TeamActivityProgressResponseBuilder get _$this {
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
  void replace(TeamActivityProgressResponse other) {
    _$v = other as _$TeamActivityProgressResponse;
  }

  @override
  void update(void Function(TeamActivityProgressResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TeamActivityProgressResponse build() => _build();

  _$TeamActivityProgressResponse _build() {
    _$TeamActivityProgressResponse _$result;
    try {
      _$result = _$v ??
          _$TeamActivityProgressResponse._(
            success: BuiltValueNullFieldError.checkNotNull(
                success, r'TeamActivityProgressResponse', 'success'),
            message: BuiltValueNullFieldError.checkNotNull(
                message, r'TeamActivityProgressResponse', 'message'),
            data: data.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'data';
        data.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TeamActivityProgressResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
